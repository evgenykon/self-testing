<script setup lang="ts">
const props = defineProps<{
  points: { x: number, y: number, label: string }[]
}>()

const WIDTH = 600
const HEIGHT = 160
const PAD_X = 10
const PAD_Y = 14
const GRID = [0, 50, 100]

function yFor(percent: number): number {
  const clamped = Math.max(0, Math.min(100, percent))
  return PAD_Y + (1 - clamped / 100) * (HEIGHT - PAD_Y * 2)
}

const chart = computed(() => {
  const list = props.points
  if (list.length === 0) {
    return null
  }
  const minX = list[0]!.x
  const maxX = list[list.length - 1]!.x
  const spanX = maxX - minX
  const coords = list.map((point, index) => {
    const ratio = spanX > 0
      ? (point.x - minX) / spanX
      : (list.length > 1 ? index / (list.length - 1) : 0.5)
    return {
      cx: PAD_X + ratio * (WIDTH - PAD_X * 2),
      cy: yFor(point.y),
      label: point.label,
      key: `${point.x}-${index}`,
    }
  })
  const line = coords.map(point => `${point.cx.toFixed(1)},${point.cy.toFixed(1)}`).join(' ')
  const area = `${PAD_X},${yFor(0)} ${line} ${WIDTH - PAD_X},${yFor(0)}`
  return { coords, line, area }
})
</script>

<template>
  <svg
    :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
    class="h-36 w-full sm:h-40"
    role="img"
    aria-label="График процента набранных баллов по попыткам"
  >
    <g v-if="chart">
      <line
        v-for="level in GRID"
        :key="level"
        :x1="PAD_X"
        :x2="WIDTH - PAD_X"
        :y1="yFor(level)"
        :y2="yFor(level)"
        class="stroke-slate-200"
        stroke-width="1"
        stroke-dasharray="4 4"
      />
      <polygon v-if="chart.coords.length > 1" :points="chart.area" class="fill-indigo-500/10" />
      <polyline
        v-if="chart.coords.length > 1"
        :points="chart.line"
        fill="none"
        class="stroke-indigo-500"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle
        v-for="point in chart.coords"
        :key="point.key"
        :cx="point.cx"
        :cy="point.cy"
        r="4"
        class="fill-white stroke-indigo-500"
        stroke-width="2.5"
      >
        <title>{{ point.label }}</title>
      </circle>
    </g>
  </svg>
</template>
