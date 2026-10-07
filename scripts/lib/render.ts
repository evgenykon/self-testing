import katex from 'katex'
import MarkdownIt from 'markdown-it'
import type { StateInline } from 'markdown-it/lib/rules_inline/state_inline.mjs'
import type { StateBlock } from 'markdown-it/lib/rules_block/state_block.mjs'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function renderMath(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
    })
  }
  catch {
    return `<code>${escapeHtml(tex)}</code>`
  }
}

function isSpace(code: number): boolean {
  return code === 0x20 || code === 0x09
}

function mathInlineRule(state: StateInline, silent: boolean): boolean {
  const start = state.pos
  if (state.src.charCodeAt(start) !== 0x24) {
    return false
  }
  if (start + 1 >= state.posMax || isSpace(state.src.charCodeAt(start + 1))) {
    return false
  }

  let end = start + 1
  while (end < state.posMax) {
    const code = state.src.charCodeAt(end)
    if (code === 0x0a) {
      return false
    }
    if (code === 0x24 && state.src.charCodeAt(end - 1) !== 0x5c) {
      break
    }
    end++
  }
  if (end >= state.posMax || end === start + 1) {
    return false
  }
  if (isSpace(state.src.charCodeAt(end - 1))) {
    return false
  }

  const content = state.src.slice(start + 1, end)
  if (!content.trim()) {
    return false
  }
  if (!silent) {
    const token = state.push('math_inline', 'math', 0)
    token.content = content
    token.markup = '$'
  }
  state.pos = end + 1
  return true
}

function mathBlockRule(state: StateBlock, startLine: number, endLine: number, silent: boolean): boolean {
  const start = state.bMarks[startLine]! + state.tShift[startLine]!
  const max = state.eMarks[startLine]!
  if (start + 2 > max) {
    return false
  }
  if (state.src.slice(start, start + 2) !== '$$') {
    return false
  }

  const firstLine = state.src.slice(start + 2, max)
  let content = ''
  let found = false
  let nextLine = startLine + 1

  if (firstLine.trimEnd().endsWith('$$') && firstLine.trim().length > 2) {
    content = firstLine.trim().slice(0, -2).trim()
    found = content.length > 0
  }
  else {
    let buffer = firstLine.trim() === '$$' ? '' : firstLine
    while (nextLine < endLine) {
      const lineStart = state.bMarks[nextLine]! + state.tShift[nextLine]!
      const lineEnd = state.eMarks[nextLine]!
      const line = state.src.slice(lineStart, lineEnd)
      const closeIndex = line.indexOf('$$')
      if (closeIndex >= 0) {
        buffer += `${buffer ? '\n' : ''}${line.slice(0, closeIndex)}`
        content = buffer.trim()
        found = content.length > 0
        nextLine++
        break
      }
      buffer += `${buffer ? '\n' : ''}${line}`
      nextLine++
    }
  }

  if (!found) {
    return false
  }
  if (!silent) {
    const token = state.push('math_block', 'math', 0)
    token.block = true
    token.content = content
    token.markup = '$$'
    token.map = [startLine, nextLine]
  }
  state.line = nextLine
  return true
}

export function katexPlugin(md: MarkdownIt): void {
  md.inline.ruler.after('escape', 'math_inline', mathInlineRule)
  md.block.ruler.after('blockquote', 'math_block', mathBlockRule, {
    alt: ['paragraph', 'reference', 'blockquote', 'list'],
  })
  md.renderer.rules.math_inline = (tokens, idx) => renderMath(tokens[idx]?.content ?? '', false)
  md.renderer.rules.math_block = (tokens, idx) => renderMath(tokens[idx]?.content ?? '', true)
}

const md = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
  breaks: false,
}).use(katexPlugin)

export function renderBlock(source: string): string {
  return md.render(source)
}

export function renderInline(source: string): string {
  return md.renderInline(source)
}

export function rewriteUrls(html: string, rewrite: (url: string) => string): string {
  return html.replace(/\b(src|href)="([^"]*)"/g, (full, attr: string, url: string) => {
    const next = rewrite(url)
    return next === url ? full : `${attr}="${next}"`
  })
}
