import { describe, expect, it } from 'vitest'
import { normalizeAnswer, scoreInput, scoreMultiple, scoreSingle } from '../shared/scoring.ts'

describe('scoreSingle', () => {
  it('начисляет 2 за верный и 0 за неверный ответ', () => {
    expect(scoreSingle('c1', 'c1')).toBe(2)
    expect(scoreSingle('c2', 'c1')).toBe(0)
    expect(scoreSingle('', 'c1')).toBe(0)
    expect(scoreSingle(undefined, 'c1')).toBe(0)
  })
})

describe('scoreMultiple', () => {
  it('2 балла за полный правильный набор', () => {
    expect(scoreMultiple(['a', 'b'], ['a', 'b'])).toBe(2)
    expect(scoreMultiple(['b', 'a'], ['a', 'b'])).toBe(2)
  })

  it('1 балл за подмножество без ошибок', () => {
    expect(scoreMultiple(['a'], ['a', 'b'])).toBe(1)
  })

  it('0 баллов за любой лишний вариант', () => {
    expect(scoreMultiple(['a', 'x'], ['a', 'b'])).toBe(0)
    expect(scoreMultiple(['x'], ['a', 'b'])).toBe(0)
  })

  it('0 баллов без ответа', () => {
    expect(scoreMultiple([], ['a'])).toBe(0)
  })
})

describe('scoreInput', () => {
  const accepted = ['Париж', 'Paris']

  it('2 балла за точное совпадение без учёта регистра и лишних пробелов', () => {
    expect(scoreInput('париж', accepted, [])).toBe(2)
    expect(scoreInput('  ПАРИЖ  ', accepted, [])).toBe(2)
    expect(scoreInput('Paris', accepted, [])).toBe(2)
  })

  it('нормализует ё и е', () => {
    expect(scoreInput('Тёплый', ['Теплый'], [])).toBe(2)
    expect(scoreInput('Теплый', ['Тёплый'], [])).toBe(2)
  })

  it('1 балл за частичное совпадение по regex', () => {
    expect(scoreInput('парижем', accepted, ['^париж.*'])).toBe(1)
  })

  it('0 баллов за неверный или пустой ответ', () => {
    expect(scoreInput('Лондон', accepted, ['^париж.*'])).toBe(0)
    expect(scoreInput('   ', accepted, [])).toBe(0)
  })
})

describe('normalizeAnswer', () => {
  it('приводит строку к каноническому виду', () => {
    expect(normalizeAnswer('  Ёж   и   Еж ')).toBe('еж и еж')
  })
})
