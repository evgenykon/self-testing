export function createLocalListStore<T>(key: string) {
  const items = ref<T[]>([])
  const ready = ref(false)
  let initialized = false

  function init() {
    if (!import.meta.client || initialized) {
      return
    }
    initialized = true
    try {
      const raw = localStorage.getItem(key)
      const parsed: unknown = raw ? JSON.parse(raw) : []
      if (Array.isArray(parsed)) {
        items.value = parsed as T[]
      }
    }
    catch {
      items.value = []
    }
    ready.value = true
  }

  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify(items.value))
    }
    catch {
      // localStorage может быть недоступен (приватный режим, переполнение)
    }
  }

  return { items, ready, init, persist }
}
