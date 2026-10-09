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

  return { attempts: store.items, ready: store.ready, addAttempt, clearAttempts }
}
