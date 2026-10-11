import type { AttemptRecord } from '~/lib/test-types'

const store = createLocalListStore<AttemptRecord>('self-testing:attempts:v1')

export function useAttempts() {
  onMounted(store.init)

  function addAttempt(record: AttemptRecord) {
    store.init()
    store.items.value = [...store.items.value, record]
    store.persist()
  }

  function clearAttempts() {
    store.init()
    store.items.value = []
    store.persist()
  }

  const bestBySlug = computed(() => {
    const map = new Map<string, number>()
    for (const attempt of store.items.value) {
      const current = map.get(attempt.slug)
      if (current === undefined || attempt.percent > current) {
        map.set(attempt.slug, attempt.percent)
      }
    }
    return map
  })

  return { attempts: store.items, bestBySlug, ready: store.ready, addAttempt, clearAttempts }
}
