import type { UnknownQuestionRecord } from '~/lib/test-types'

const store = createLocalListStore<UnknownQuestionRecord>('self-testing:unknown:v1')

export function useUnknownQuestions() {
  onMounted(store.init)

  const count = computed(() => store.items.value.length)

  function isMarked(slug: string, questionId: string): boolean {
    return store.items.value.some(item => item.key === `${slug}:${questionId}`)
  }

  function mark(record: UnknownQuestionRecord) {
    store.init()
    if (isMarked(record.slug, record.questionId)) {
      return
    }
    store.items.value = [...store.items.value, record]
    store.persist()
  }

  function unmark(slug: string, questionId: string) {
    store.init()
    store.items.value = store.items.value.filter(item => item.key !== `${slug}:${questionId}`)
    store.persist()
  }

  function clearAll() {
    store.init()
    store.items.value = []
    store.persist()
  }

  return { items: store.items, ready: store.ready, count, isMarked, mark, unmark, clearAll }
}
