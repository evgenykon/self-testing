import matter from 'gray-matter'
import type { QuestionType, TimerConfig } from '../../shared/types.ts'
import type { RawChoice, RawQuestion, TestDefinition } from './types.ts'

const QUESTION_OPEN = /^:::question\s*(?:\{([^}]*)\})?\s*$/
const BLOCK_CLOSE = /^:::\s*$/
const NESTED_OPEN = /^:::(explanation|accepted|partial)\s*$/
const CHOICE_LINE = /^\s*[-*]\s+\[([ xX])\]\s+(.*)$/

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const re = /([A-Za-z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s,}]+))/g
  let match: RegExpExecArray | null
  while ((match = re.exec(raw)) !== null) {
    attrs[match[1]!] = match[2] ?? match[3] ?? match[4] ?? ''
  }
  return attrs
}

function parseTimer(raw: unknown): TimerConfig {
  if (raw === undefined || raw === null) {
    return { mode: 'none' }
  }
  if (typeof raw === 'string') {
    return { mode: raw as TimerConfig['mode'] }
  }
  if (typeof raw === 'object') {
    const data = raw as Record<string, unknown>
    const timer: TimerConfig = { mode: (data.mode as TimerConfig['mode']) ?? 'none' }
    if (typeof data.seconds === 'number') {
      timer.seconds = data.seconds
    }
    if (typeof data.perQuestion === 'number') {
      timer.perQuestion = data.perQuestion
    }
    return timer
  }
  return { mode: 'none' }
}

function parseQuestions(content: string): RawQuestion[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const questions: RawQuestion[] = []
  let i = 0

  while (i < lines.length) {
    const open = QUESTION_OPEN.exec(lines[i]!)
    if (!open) {
      i++
      continue
    }

    const attrs = parseAttrs(open[1] ?? '')
    const bodyLines: string[] = []
    let explanation: string | null = null
    let accepted: string[] = []
    let partial: string[] = []

    i++
    while (i < lines.length && !BLOCK_CLOSE.test(lines[i]!)) {
      const nested = NESTED_OPEN.exec(lines[i]!)
      if (nested) {
        const inner: string[] = []
        i++
        while (i < lines.length && !BLOCK_CLOSE.test(lines[i]!)) {
          inner.push(lines[i]!)
          i++
        }
        if (i < lines.length) {
          i++
        }
        const name = nested[1]
        if (name === 'explanation') {
          explanation = inner.join('\n').trim() || null
        }
        else if (name === 'accepted') {
          accepted = inner.map(line => line.trim()).filter(Boolean)
        }
        else {
          partial = inner.map(line => line.trim()).filter(Boolean)
        }
        continue
      }
      bodyLines.push(lines[i]!)
      i++
    }
    if (i < lines.length) {
      i++
    }

    const choices: RawChoice[] = []
    const body: string[] = []
    for (const line of bodyLines) {
      const choice = CHOICE_LINE.exec(line)
      if (choice) {
        choices.push({ correct: choice[1] !== ' ', text: choice[2]!.trim() })
      }
      else {
        body.push(line)
      }
    }

    questions.push({
      id: `q${questions.length + 1}`,
      type: (attrs.type ?? '') as QuestionType,
      body: body.join('\n').trim(),
      choices,
      accepted,
      partial,
      explanation,
    })
  }

  return questions
}

export function parseTestSource(source: string, slug: string): TestDefinition {
  const { data, content } = matter(source)
  return {
    slug,
    title: String(data.title ?? '').trim(),
    topic: String(data.topic ?? '').trim(),
    description: String(data.description ?? '').trim(),
    timer: parseTimer(data.timer),
    shuffleQuestions: data.shuffleQuestions !== false,
    shuffleAnswers: data.shuffleAnswers !== false,
    questions: parseQuestions(content),
  }
}
