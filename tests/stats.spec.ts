import { describe, expect, it } from 'vitest'
import { averagePercent, groupAttempts } from '../app/utils/stats.ts'

const ATTEMPTS = [
  { slug: 'a', title: 'Тест A', percent: 40, finishedAt: 100 },
  { slug: 'b', title: 'Тест B', percent: 90, finishedAt: 200 },
  { slug: 'a', title: 'Тест A', percent: 80, finishedAt: 300 },
]

describe('groupAttempts', () => {
  it('группирует по тесту и сортирует попытки по времени', () => {
    const groups = groupAttempts(ATTEMPTS)
    expect(groups.map(group => group.slug)).toEqual(['a', 'b'])
    expect(groups[0]!.attempts.map(attempt => attempt.percent)).toEqual([40, 80])
  })

  it('считает лучший, последний и средний результат', () => {
    const [first] = groupAttempts(ATTEMPTS)
    expect(first!.best).toBe(80)
    expect(first!.last).toBe(80)
    expect(first!.average).toBe(60)
  })

  it('сортирует группы по последней попытке', () => {
    const groups = groupAttempts([
      { slug: 'x', title: 'X', percent: 10, finishedAt: 1 },
      { slug: 'y', title: 'Y', percent: 10, finishedAt: 2 },
    ])
    expect(groups.map(group => group.slug)).toEqual(['y', 'x'])
  })

  it('на пустом списке возвращает пустой массив', () => {
    expect(groupAttempts([])).toEqual([])
  })
})

describe('averagePercent', () => {
  it('округляет средний процент', () => {
    expect(averagePercent([{ percent: 50 }, { percent: 75 }])).toBe(63)
  })

  it('на пустом списке возвращает 0', () => {
    expect(averagePercent([])).toBe(0)
  })
})
