<script setup lang="ts">
const props = defineProps<{ bestPercent?: number | null }>()

const status = computed<{ label: string, color: string } | null>(() => {
  if (props.bestPercent == null) {
    return null
  }
  if (props.bestPercent === 100) {
    return { label: 'Пройден на 100%', color: 'text-emerald-600' }
  }
  return { label: 'Пройден не полностью', color: 'text-amber-500' }
})
</script>

<template>
  <svg
    v-if="status"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="shrink-0"
    :class="status.color"
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
</template>