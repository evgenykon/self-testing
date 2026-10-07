import type { Score } from '#shared/scoring'
import type { QuestionType, TimerConfig } from '#shared/types'

export interface RuntimeChoice {
  id: string
  html: string
}

export interface RuntimeQuestion {
  id: string
  type: QuestionType
  html: string
  choices: RuntimeChoice[]
  accepted: string[]
  partial: string[]
  explanationHtml: string | null
}

export interface RuntimeTest {
  slug: string
  title: string
  topic: string
  description: string
  timer: TimerConfig
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  questions: RuntimeQuestion[]
  correct: Record<string, string[]>
}

export interface TestIndexEntry {
  slug: string
  title: string
  topic: string
  description: string
  questionCount: number
  timer: TimerConfig
}

export interface QuestionResult {
  question: RuntimeQuestion
  selected: string[]
  answerText: string
  score: Score
  correctIds: string[]
}
