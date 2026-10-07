import { describe, expect, it } from 'vitest'
import { parseTestSource } from '../scripts/lib/parse.ts'
import { validateTest } from '../scripts/lib/validate.ts'

function make(source: string, slug = 'test') {
  return parseTestSource(source, slug)
}

const HEADER = '---\ntitle: T\ntopic: X\n---\n\n'

describe('validateTest', () => {
  it('принимает корректный тест', () => {
    const test = make(`${HEADER}:::question{type=single}\nQ\n- [x] A\n- [ ] B\n:::\n`)
    expect(() => validateTest(test)).not.toThrow()
  })

  it('требует ровно один правильный вариант для single', () => {
    const test = make(`${HEADER}:::question{type=single}\nQ\n- [ ] A\n- [ ] B\n:::\n`)
    expect(() => validateTest(test)).toThrow(/ровно один правильный/)
  })

  it('требует правильный вариант для multiple', () => {
    const test = make(`${HEADER}:::question{type=multiple}\nQ\n- [ ] A\n- [ ] B\n:::\n`)
    expect(() => validateTest(test)).toThrow(/хотя бы один правильный/)
  })

  it('требует accepted или partial для input', () => {
    const test = make(`${HEADER}:::question{type=input}\nQ\n:::\n`)
    expect(() => validateTest(test)).toThrow(/accepted или :::partial/)
  })

  it('отвергает варианты у input', () => {
    const test = make(`${HEADER}:::question{type=input}\nQ\n- [x] A\n\n:::accepted\nA\n:::\n:::\n`)
    expect(() => validateTest(test)).toThrow(/варианты ответа недопустимы/)
  })

  it('отвергает неизвестный тип', () => {
    const test = make(`${HEADER}:::question{type=quiz}\nQ\n- [x] A\n- [ ] B\n:::\n`)
    expect(() => validateTest(test)).toThrow(/неизвестный тип/)
  })

  it('проверяет таймер', () => {
    const test = make(`---\ntitle: T\ntopic: X\ntimer:\n  mode: test\n---\n\n:::question{type=single}\nQ\n- [x] A\n- [ ] B\n:::\n`)
    expect(() => validateTest(test)).toThrow(/timer.seconds/)
  })

  it('проверяет regex в partial', () => {
    const test = make(`${HEADER}:::question{type=input}\nQ\n:::partial\n[невалид\n:::\n:::\n`)
    expect(() => validateTest(test)).toThrow(/регулярное выражение/)
  })

  it('требует вопросы и метаданные', () => {
    expect(() => validateTest(make('---\ntitle: T\ntopic: X\n---\n'))).toThrow(/ни одного блока/)
    expect(() => validateTest(make('---\ntopic: X\n---\n\n:::question{type=single}\nQ\n- [x] A\n- [ ] B\n:::\n'))).toThrow(/title/)
    expect(() => validateTest(make('---\ntitle: T\n---\n\n:::question{type=single}\nQ\n- [x] A\n- [ ] B\n:::\n'))).toThrow(/topic/)
  })

  it('проверяет slug', () => {
    const test = make(`${HEADER}:::question{type=single}\nQ\n- [x] A\n- [ ] B\n:::\n`, 'Плохой Slug')
    expect(() => validateTest(test)).toThrow(/имя файла/)
  })
})
