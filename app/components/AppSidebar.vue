<script setup lang="ts">
const route = useRoute()
const { topics, tests } = useTestsIndex()

function isActive(slug: string): boolean {
  return route.path === `/tests/${slug}`
}
</script>

<template>
  <nav class="p-4">
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
