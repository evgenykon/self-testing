<script setup lang="ts">
import type { Score } from '#shared/scoring'

const props = defineProps<{ score: Score }>()

const config = computed(() => ({
  2: { label: 'Верно', class: 'bg-emerald-100 text-emerald-800' },
  1: { label: 'Частично', class: 'bg-amber-100 text-amber-800' },
  0: { label: 'Неверно', class: 'bg-red-100 text-red-700' },
})[props.score])
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
    :class="config.class"
  >
    {{ config.label }} · {{ score }}/2
  </span>
</template>
