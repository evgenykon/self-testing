import { fileURLToPath } from 'node:url'
import { buildContent } from './lib/generate.ts'

const rootDir = fileURLToPath(new URL('..', import.meta.url))
const baseURL = process.env.NUXT_APP_BASE_URL || '/'

try {
  const summary = await buildContent({ rootDir, baseURL })
  console.log(`[content] тестов: ${summary.tests}, вопросов: ${summary.questions}, baseURL: ${baseURL}`)
  for (const entry of summary.entries) {
    console.log(`[content]   - ${entry.slug}: ${entry.title} (${entry.questionCount} вопр., тема «${entry.topic}»)`)
  }
}
catch (error) {
  console.error(`[content] ошибка сборки контента: ${(error as Error).message}`)
  process.exit(1)
}
