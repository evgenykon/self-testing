export interface AttemptLike {
  slug: string
  title: string
  percent: number
  finishedAt: number
}

export interface AttemptGroup<T extends AttemptLike> {
  slug: string
  title: string
  attempts: T[]
  best: number
  last: number
  average: number
}

export function groupAttempts<T extends AttemptLike>(list: T[]): AttemptGroup<T>[] {
  const groups = new Map<string, T[]>()
  for (const attempt of list) {
    const group = groups.get(attempt.slug) ?? []
    group.push(attempt)
    groups.set(attempt.slug, group)
  }
  return [...groups.entries()]
    .map(([slug, items]) => {
      const attempts = [...items].sort((a, b) => a.finishedAt - b.finishedAt)
      const sum = attempts.reduce((total, attempt) => total + attempt.percent, 0)
      return {
        slug,
        title: attempts[attempts.length - 1]!.title,
        attempts,
        best: Math.max(...attempts.map(attempt => attempt.percent)),
        last: attempts[attempts.length - 1]!.percent,
        average: Math.round(sum / attempts.length),
      }
    })
    .sort((a, b) => b.attempts[b.attempts.length - 1]!.finishedAt - a.attempts[a.attempts.length - 1]!.finishedAt)
}

export function averagePercent(list: { percent: number }[]): number {
  if (list.length === 0) {
    return 0
  }
  return Math.round(list.reduce((sum, item) => sum + item.percent, 0) / list.length)
}
