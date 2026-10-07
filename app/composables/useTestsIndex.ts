import testsJson from '~/generated/tests.json'
import type { TestIndexEntry } from '~/lib/test-types'

export interface TopicGroup {
  name: string
  tests: TestIndexEntry[]
}

const tests = testsJson as unknown as TestIndexEntry[]

export function useTestsIndex() {
  const topics = computed<TopicGroup[]>(() => {
    const groups = new Map<string, TestIndexEntry[]>()
    for (const test of tests) {
      const list = groups.get(test.topic) ?? []
      list.push(test)
      groups.set(test.topic, list)
    }
    return [...groups.entries()]
      .map(([name, list]) => ({ name, tests: list }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  })

  const totalQuestions = computed(() => tests.reduce((sum, test) => sum + test.questionCount, 0))

  return { tests, topics, totalQuestions }
}
