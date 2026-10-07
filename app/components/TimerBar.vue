<script setup lang="ts">
const props = defineProps<{
  label: string
  percent: number
  tone: 'brand' | 'warn' | 'danger'
}>()

const barClass = computed(() => ({
  brand: 'bg-indigo-500',
  warn: 'bg-amber-500',
  danger: 'bg-red-500',
})[props.tone])
</script>

<template>
  <div>
    <div class="mb-1.5 flex items-center justify-between gap-3 text-sm">
      <span class="font-medium text-slate-700">{{ label }}</span>
      <slot name="aside" />
    </div>
    <div class="h-2 overflow-hidden rounded-full bg-slate-200">
      <div
        class="h-full rounded-full transition-[width] duration-200 ease-linear"
        :class="barClass"
        :style="{ width: `${Math.max(0, Math.min(100, percent))}%` }"
      />
    </div>
  </div>
</template>
