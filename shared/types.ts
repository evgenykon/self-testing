export type QuestionType = 'single' | 'multiple' | 'input'

export type TimerMode = 'none' | 'test' | 'question'

export interface TimerConfig {
  mode: TimerMode
  seconds?: number
  perQuestion?: number
}
