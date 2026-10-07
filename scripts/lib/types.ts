import type { QuestionType, TimerConfig } from '../../shared/types.ts'

export interface RawChoice {
  text: string
  correct: boolean
}

export interface RawQuestion {
  id: string
  type: QuestionType
  body: string
  choices: RawChoice[]
  accepted: string[]
  partial: string[]
  explanation: string | null
}

export interface TestDefinition {
  slug: string
  title: string
  topic: string
  description: string
  timer: TimerConfig
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  questions: RawQuestion[]
}

export interface RenderedChoice {
  id: string
  html: string
  correct: boolean
}

export interface RenderedQuestion {
  id: string
  type: QuestionType
  html: string
  choices: RenderedChoice[]
  accepted: string[]
  partial: string[]
  explanationHtml: string | null
}

export interface TestPayload {
  slug: string
  title: string
  topic: string
  description: string
  timer: TimerConfig
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  questions: RenderedQuestion[]
}

export interface TestIndexEntry {
  slug: string
  title: string
  topic: string
  description: string
  questionCount: number
  timer: TimerConfig
}
