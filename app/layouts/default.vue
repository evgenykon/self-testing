<script setup lang="ts">
const mobileOpen = ref(false)
const route = useRoute()

watch(() => route.fullPath, () => {
  mobileOpen.value = false
})
</script>

<template>
  <div class="min-h-screen">
    <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div class="flex h-14 items-center gap-3 px-4 sm:px-6">
        <button
          class="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Открыть меню"
          @click="mobileOpen = true"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-slate-900">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">S</span>
          Self Testing
        </NuxtLink>
      </div>
    </header>

    <div class="mx-auto flex w-full max-w-6xl">
      <aside class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:block">
        <AppSidebar />
      </aside>

      <main class="min-w-0 flex-1 px-4 py-8 sm:px-8">
        <slot />
      </main>
    </div>

    <div v-if="mobileOpen" class="fixed inset-0 z-40 lg:hidden">
      <div class="absolute inset-0 bg-slate-900/40" @click="mobileOpen = false" />
      <aside class="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-200 p-4">
          <span class="font-semibold text-slate-900">Тесты</span>
          <button
            class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Закрыть меню"
            @click="mobileOpen = false"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <AppSidebar />
      </aside>
    </div>
  </div>
</template>
