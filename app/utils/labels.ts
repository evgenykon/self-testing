import type { QuestionType, TimerConfig } from '#shared/types'

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (minutes === 0) {
    return `${rest} с`
  }
  if (rest === 0) {
    return `${minutes} мин`
  }
  return `${minutes} мин ${rest} с`
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function timerLabel(timer: TimerConfig): string {
  if (timer.mode === 'test') {
    return `Таймер: ${formatDuration(timer.seconds ?? 0)} на тест`
  }
  if (timer.mode === 'question') {
    return `Таймер: ${formatDuration(timer.perQuestion ?? 0)} на вопрос`
  }
  return 'Без таймера'
}

export function questionTypeLabel(type: QuestionType): string {
  if (type === 'single') {
    return 'Один ответ'
  }
  if (type === 'multiple') {
    return 'Несколько ответов'
  }
  return 'Ввод ответа'
}

export function plural(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) {
    return one
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return few
  }
  return many
}
