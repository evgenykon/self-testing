<script setup lang="ts">
import type { TestIndexEntry } from '~/lib/test-types'

const props = defineProps<{ test: TestIndexEntry, bestPercent?: number | null }>()

const status = computed<{ id: 'perfect' | 'attempted', label: string, class: string } | null>(() => {
  if (props.bestPercent == null) {
    return null
  }
  if (props.bestPercent === 100) {
    return { id: 'perfect', label: 'Пройден на 100%', class: 'text-emerald-600' }
  }
  return { id: 'attempted', label: 'Пройден не полностью', class: 'text-amber-500' }
})
</script>

<template>
  <NuxtLink
    :to="`/tests/${test.slug}`"
    class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
  >
    <span class="mb-2 text-xs font-medium uppercase tracking-wide text-indigo-600">{{ test.topic }}</span>
    <div class="flex items-start gap-2.5">
      <svg
        v-if="status"
        viewBox="0 0 24 24"
        fill="currentColor"
        :class="['mt-0.5 h-6 w-6 shrink-0', status.class]"
        role="img"
        :aria-label="status.label"
      >
        <title>{{ status.label }}</title>
        <path
          fill-rule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          clip-rule="evenodd"
        />
      </svg>
      <h3 class="text-lg font-semibold text-slate-900 group-hover:text-indigo-700">{{ test.title }}</h3>
    </div>
    <p v-if="test.description" class="mt-1.5 line-clamp-2 text-sm text-slate-500">{{ test.description }}</p>
    <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
      <span>{{ test.questionCount }} {{ plural(test.questionCount, 'вопрос', 'вопроса', 'вопросов') }}</span>
      <span class="h-1 w-1 rounded-full bg-slate-300" />
      <span>{{ timerLabel(test.timer) }}</span>
    </div>
  </NuxtLink>
</template>
