import { describe, expect, it } from 'vitest'
import { renderBlock, renderInline, rewriteUrls } from '../scripts/lib/render.ts'

describe('markdown + katex рендер', () => {
  it('рендерит inline-формулу', () => {
    const html = renderInline('Формула $E=mc^2$ тут')
    expect(html).toContain('katex')
  })

  it('рендерит блочную формулу', () => {
    const html = renderBlock('$$\n\\lim_{x \\to 0} \\frac{\\sin x}{x}\n$$')
    expect(html).toContain('katex-display')
  })

  it('рендерит блочную формулу в одну строку', () => {
    const html = renderBlock('$$a^2 + b^2 = c^2$$')
    expect(html).toContain('katex-display')
  })

  it('не превращает цены в формулы', () => {
    const html = renderInline('Цена $5 и $10 за штуку')
    expect(html).not.toContain('katex')
  })

  it('не трогает формулы внутри кода', () => {
    const html = renderInline('Код `$x$` не формула')
    expect(html).not.toContain('katex')
  })

  it('рендерит markdown', () => {
    const html = renderBlock('**жирный** и [ссылка](/x)')
    expect(html).toContain('<strong>')
    expect(html).toContain('href="/x"')
  })

  it('не пропускает сырой html', () => {
    const html = renderBlock('<script>alert(1)</script>')
    expect(html).not.toContain('<script>')
  })

  it('rewriteUrls переписывает ссылки', () => {
    const rewrite = (url: string) => (url.startsWith('/') ? `/base/${url.slice(1)}` : url)
    expect(rewriteUrls('<img src="/images/a.png" alt="x">', rewrite)).toBe('<img src="/base/images/a.png" alt="x">')
    expect(rewriteUrls('<a href="https://example.com">x</a>', rewrite)).toBe('<a href="https://example.com">x</a>')
  })
})
