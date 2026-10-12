<script setup lang="ts">
import katex from 'katex'

const props = defineProps<{ tex: string, display?: boolean }>()

const html = computed(() => katex.renderToString(props.tex, {
  displayMode: props.display ?? false,
  throwOnError: false,
  strict: false,
  trust: false,
}))
</script>

<template>
  <span v-html="html" />
</template>