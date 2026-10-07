import { describe, expect, it } from 'vitest'
import { parseTestSource } from '../scripts/lib/parse.ts'

const SOURCE = `---
title: Демо-тест
topic: Демо
description: Проверка парсера
timer:
  mode: question
  perQuestion: 45
shuffleAnswers: false
---

Некоторый текст до вопросов.

:::question{type="single"}
Сколько будет $2+2$?

- [ ] 3
- [x] 4
- [ ] 5

:::explanation
Простое сложение.
:::
:::

:::question{type=multiple}
Выберите чётные:
- [x] 2
- [ ] 3
- [x] 4
:::

:::question{type=input}
Столица Франции?

:::accepted
Париж
Paris
:::

:::partial
^париж.*
:::
:::
`

describe('parseTestSource', () => {
  it('читает frontmatter', () => {
    const test = parseTestSource(SOURCE, 'demo')
    expect(test.title).toBe('Демо-тест')
    expect(test.topic).toBe('Демо')
    expect(test.description).toBe('Проверка парсера')
    expect(test.timer).toEqual({ mode: 'question', perQuestion: 45 })
    expect(test.shuffleQuestions).toBe(true)
    expect(test.shuffleAnswers).toBe(false)
  })

  it('парсит вопросы всех типов', () => {
    const test = parseTestSource(SOURCE, 'demo')
    expect(test.questions).toHaveLength(3)

    const [single, multiple, input] = test.questions
    expect(single!.type).toBe('single')
    expect(single!.id).toBe('q1')
    expect(single!.choices.map(choice => choice.correct)).toEqual([false, true, false])
    expect(single!.body).toContain('$2+2$')
    expect(single!.body).not.toContain('[x]')
    expect(single!.explanation).toBe('Простое сложение.')

    expect(multiple!.type).toBe('multiple')
    expect(multiple!.choices).toHaveLength(3)
    expect(multiple!.choices.filter(choice => choice.correct).map(choice => choice.text)).toEqual(['2', '4'])

    expect(input!.type).toBe('input')
    expect(input!.choices).toHaveLength(0)
    expect(input!.accepted).toEqual(['Париж', 'Paris'])
    expect(input!.partial).toEqual(['^париж.*'])
  })

  it('не путает вопросы и внешний текст', () => {
    const test = parseTestSource(SOURCE, 'demo')
    expect(test.questions.every(question => !question.body.includes('Некоторый текст'))).toBe(true)
  })

  it('по умолчанию без таймера и с перемешиванием', () => {
    const test = parseTestSource('---\ntitle: X\ntopic: Y\n---\n\n:::question{type=single}\nQ?\n- [x] A\n- [ ] B\n:::\n', 'x')
    expect(test.timer).toEqual({ mode: 'none' })
    expect(test.shuffleQuestions).toBe(true)
    expect(test.shuffleAnswers).toBe(true)
  })
})
