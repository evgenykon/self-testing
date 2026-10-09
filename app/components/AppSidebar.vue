<script setup lang="ts">
const route = useRoute()
const { topics, tests } = useTestsIndex()
const { count: unknownCount } = useUnknownQuestions()

function isActive(slug: string): boolean {
  return route.path === `/tests/${slug}`
}

function linkClass(path: string): string {
  return route.path === path
    ? 'bg-indigo-50 font-medium text-indigo-700'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
}
</script>

<template>
  <nav class="p-4">
    <div class="mb-6 space-y-0.5 border-b border-slate-200 pb-4">
      <NuxtLink
        to="/stats"
        class="block rounded-lg px-3 py-2 text-sm transition"
        :class="linkClass('/stats')"
      >
        Результаты
      </NuxtLink>
      <NuxtLink
        to="/review"
        class="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm transition"
        :class="linkClass('/review')"
      >
        <span>Вопросы для разбора</span>
        <span
          v-if="unknownCount > 0"
          class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700"
        >
          {{ unknownCount }}
        </span>
      </NuxtLink>
    </div>

    <p v-if="!tests.length" class="px-3 py-2 text-sm text-slate-500">
      Тесты пока не добавлены
    </p>
    <div v-for="topic in topics" :key="topic.name" class="mb-6 last:mb-0">
      <h3 class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {{ topic.name }}
      </h3>
      <ul class="space-y-0.5">
        <li v-for="test in topic.tests" :key="test.slug">
          <NuxtLink
            :to="`/tests/${test.slug}`"
            class="block rounded-lg px-3 py-2 text-sm transition"
            :class="isActive(test.slug)
              ? 'bg-indigo-50 font-medium text-indigo-700'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'"
          >
            {{ test.title }}
            <span
              class="mt-0.5 block text-xs"
              :class="isActive(test.slug) ? 'text-indigo-500' : 'text-slate-400'"
            >
              {{ test.questionCount }} {{ plural(test.questionCount, 'вопрос', 'вопроса', 'вопросов') }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
