export type Score = 0 | 1 | 2

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFC')
    .toLowerCase()
    .replaceAll('ё', 'е')
    .replace(/\s+/g, ' ')
    .trim()
}

export function scoreSingle(selected: string | null | undefined, correctId: string | undefined): Score {
  if (!selected || !correctId) {
    return 0
  }
  return selected === correctId ? 2 : 0
}

export function scoreMultiple(selected: readonly string[], correctIds: readonly string[]): Score {
  if (selected.length === 0 || correctIds.length === 0) {
    return 0
  }
  const correct = new Set(correctIds)
  const chosen = new Set(selected)
  for (const id of chosen) {
    if (!correct.has(id)) {
      return 0
    }
  }
  return chosen.size === correct.size ? 2 : 1
}

export function scoreInput(value: string, accepted: readonly string[], partial: readonly string[]): Score {
  const normalized = normalizeAnswer(value)
  if (!normalized) {
    return 0
  }
  if (accepted.some(item => normalizeAnswer(item) === normalized)) {
    return 2
  }
  for (const pattern of partial) {
    try {
      if (new RegExp(pattern, 'iu').test(normalized)) {
        return 1
      }
    }
    catch {
      // некорректный regex пропускаем — валидатор контента сообщит об этом на сборке
    }
  }
  return 0
}
