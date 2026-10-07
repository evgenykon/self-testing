<script setup lang="ts">
import type { TestIndexEntry } from '~/lib/test-types'

defineProps<{ test: TestIndexEntry }>()
</script>

<template>
  <NuxtLink
    :to="`/tests/${test.slug}`"
    class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
  >
    <span class="mb-2 text-xs font-medium uppercase tracking-wide text-indigo-600">{{ test.topic }}</span>
    <h3 class="text-lg font-semibold text-slate-900 group-hover:text-indigo-700">{{ test.title }}</h3>
    <p v-if="test.description" class="mt-1.5 line-clamp-2 text-sm text-slate-500">{{ test.description }}</p>
    <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
      <span>{{ test.questionCount }} {{ plural(test.questionCount, 'вопрос', 'вопроса', 'вопросов') }}</span>
      <span class="h-1 w-1 rounded-full bg-slate-300" />
      <span>{{ timerLabel(test.timer) }}</span>
    </div>
  </NuxtLink>
</template>
