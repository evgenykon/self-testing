import { describe, expect, it } from 'vitest'
import { shuffle } from '../shared/shuffle.ts'

function seededRng(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

describe('shuffle', () => {
  it('возвращает новый массив с теми же элементами', () => {
    const source = [1, 2, 3, 4, 5]
    const result = shuffle(source, seededRng(1))
    expect(result).not.toBe(source)
    expect([...result].sort()).toEqual([...source].sort())
  })

  it('детерминирован при заданном rng', () => {
    expect(shuffle([1, 2, 3, 4, 5], seededRng(42))).toEqual(shuffle([1, 2, 3, 4, 5], seededRng(42)))
  })

  it('реально перемешивает', () => {
    const source = Array.from({ length: 20 }, (_, index) => index)
    const result = shuffle(source, seededRng(7))
    expect(result).not.toEqual(source)
  })

  it('корректно обрабатывает пустой массив и один элемент', () => {
    expect(shuffle([], seededRng(1))).toEqual([])
    expect(shuffle(['a'], seededRng(1))).toEqual(['a'])
  })
})
