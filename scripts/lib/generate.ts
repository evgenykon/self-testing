import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { obfuscate, randomKeyHex } from '../../shared/obfuscate.ts'
import { parseTestSource } from './parse.ts'
import { renderBlock, renderInline, rewriteUrls } from './render.ts'
import type { RenderedChoice, RenderedQuestion, TestIndexEntry, TestPayload } from './types.ts'
import { validateTest } from './validate.ts'

export interface BuildOptions {
  rootDir: string
  baseURL?: string
}

export interface BuildSummary {
  tests: number
  questions: number
  entries: TestIndexEntry[]
}

function normalizeBaseURL(value: string): string {
  const trimmed = value.trim()
  if (!trimmed || trimmed === '/') {
    return '/'
  }
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}/`
}

function makeUrlRewriter(slug: string, baseURL: string): (url: string) => string {
  return (url: string): string => {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) {
      return url
    }
    if (url.startsWith('/')) {
      return `${baseURL}${url.slice(1)}`
    }
    if (url.startsWith('./assets/')) {
      return `${baseURL}tests-assets/${slug}/${url.slice('./assets/'.length)}`
    }
    return url
  }
}

async function copyTestAssets(rootDir: string, slug: string): Promise<void> {
  const source = path.join(rootDir, 'content', 'tests', 'assets', slug)
  const target = path.join(rootDir, 'public', 'tests-assets', slug)
  try {
    await cp(source, target, { recursive: true })
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }
}

export async function buildContent(options: BuildOptions): Promise<BuildSummary> {
  const { rootDir } = options
  const baseURL = normalizeBaseURL(options.baseURL ?? '/')
  const contentDir = path.join(rootDir, 'content', 'tests')
  const generatedDir = path.join(rootDir, 'app', 'generated')
  const payloadsDir = path.join(generatedDir, 'payloads')
  const publicAssetsDir = path.join(rootDir, 'public', 'tests-assets')

  await rm(generatedDir, { recursive: true, force: true })
  await rm(publicAssetsDir, { recursive: true, force: true })
  await mkdir(payloadsDir, { recursive: true })

  const files = (await readdir(contentDir, { withFileTypes: true }))
    .filter(entry => entry.isFile() && entry.name.endsWith('.md'))
    .map(entry => entry.name)
    .sort()

  if (files.length === 0) {
    throw new Error(`В ${contentDir} не найдено ни одного markdown-файла с тестом`)
  }

  const key = randomKeyHex()
  const entries: TestIndexEntry[] = []
  const pendingWrites: Promise<unknown>[] = []
  let questionCount = 0

  for (const file of files) {
    const slug = path.basename(file, '.md')
    const source = await readFile(path.join(contentDir, file), 'utf8')
    const test = parseTestSource(source, slug)
    validateTest(test)

    const rewrite = makeUrlRewriter(slug, baseURL)
    const questions: RenderedQuestion[] = test.questions.map(question => ({
      id: question.id,
      type: question.type,
      html: rewriteUrls(renderBlock(question.body), rewrite),
      choices: question.choices.map((choice, index): RenderedChoice => ({
        id: `${question.id}c${index + 1}`,
        html: rewriteUrls(renderInline(choice.text), rewrite),
        correct: choice.correct,
      })),
      accepted: question.accepted,
      partial: question.partial,
      explanationHtml: question.explanation
        ? rewriteUrls(renderBlock(question.explanation), rewrite)
        : null,
    }))

    const payload: TestPayload = {
      slug: test.slug,
      title: test.title,
      topic: test.topic,
      description: test.description,
      timer: test.timer,
      shuffleQuestions: test.shuffleQuestions,
      shuffleAnswers: test.shuffleAnswers,
      questions,
    }

    const blob = obfuscate(JSON.stringify(payload), key)
    pendingWrites.push(writeFile(
      path.join(payloadsDir, `${slug}.ts`),
      `// Автоматически сгенерировано. Не редактируйте вручную.\nexport default ${JSON.stringify(blob)}\n`,
      'utf8',
    ))

    await copyTestAssets(rootDir, slug)

    questionCount += questions.length
    entries.push({
      slug,
      title: test.title,
      topic: test.topic,
      description: test.description,
      questionCount: questions.length,
      timer: test.timer,
    })
  }

  await Promise.all(pendingWrites)

  entries.sort((a, b) => a.topic.localeCompare(b.topic, 'ru') || a.title.localeCompare(b.title, 'ru'))

  await writeFile(
    path.join(generatedDir, 'key.ts'),
    `// Автоматически сгенерировано. Не редактируйте вручную.\nexport default ${JSON.stringify(key)}\n`,
    'utf8',
  )
  await writeFile(
    path.join(generatedDir, 'tests.json'),
    `${JSON.stringify(entries, null, 2)}\n`,
    'utf8',
  )

  return { tests: entries.length, questions: questionCount, entries }
}
