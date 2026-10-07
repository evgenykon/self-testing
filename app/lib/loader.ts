import { deobfuscate } from '#shared/obfuscate'
import type { QuestionType, TimerConfig } from '#shared/types'
import key from '~/generated/key'
import type { RuntimeChoice, RuntimeQuestion, RuntimeTest } from './test-types'

interface RawChoice {
  id: string
  html: string
  correct: boolean
}

interface RawQuestion {
  id: string
  type: QuestionType
  html: string
  choices: RawChoice[]
  accepted: string[]
  partial: string[]
  explanationHtml: string | null
}

interface RawPayload {
  slug: string
  title: string
  topic: string
  description: string
  timer: TimerConfig
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  questions: RawQuestion[]
}

const payloadLoaders = import.meta.glob<{ default: string }>('../generated/payloads/*.ts')

function toRuntimeTest(payload: RawPayload): RuntimeTest {
  const correct: Record<string, string[]> = {}
  const questions: RuntimeQuestion[] = payload.questions.map((question) => {
    correct[question.id] = question.choices
      .filter(choice => choice.correct)
      .map(choice => choice.id)
    return {
      id: question.id,
      type: question.type,
      html: question.html,
      choices: question.choices.map((choice): RuntimeChoice => ({ id: choice.id, html: choice.html })),
      accepted: question.accepted,
      partial: question.partial,
      explanationHtml: question.explanationHtml,
    }
  })
  return { ...payload, questions, correct }
}

export async function loadTest(slug: string): Promise<RuntimeTest | null> {
  const loader = payloadLoaders[`../generated/payloads/${slug}.ts`]
  if (!loader) {
    return null
  }
  const module = await loader()
  const payload = JSON.parse(deobfuscate(module.default, key)) as RawPayload
  return toRuntimeTest(payload)
}
