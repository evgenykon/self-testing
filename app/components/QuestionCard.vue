<script setup lang="ts">
import type { RuntimeQuestion } from '~/lib/test-types'

const props = defineProps<{
  question: RuntimeQuestion
  index: number
  total: number
  modelValue: string[]
  locked: boolean
  marked: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string[]], 'unknown': [] }>()

const typeLabel = computed(() => questionTypeLabel(props.question.type))

function toggleChoice(id: string) {
  if (props.locked) {
    return
  }
  if (props.question.type === 'single') {
    emit('update:modelValue', [id])
    return
  }
  const selected = new Set(props.modelValue)
  if (selected.has(id)) {
    selected.delete(id)
  }
  else {
    selected.add(id)
  }
  emit('update:modelValue', [...selected])
}

function onTextInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', [target.value])
}
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <header class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <span class="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
        {{ typeLabel }}
      </span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="rounded-full border px-3 py-1 text-xs font-medium transition"
          :class="marked
            ? 'border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100'
            : 'border-slate-300 text-slate-600 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700'"
          :title="marked
            ? 'Убрать вопрос из списка для разбора'
            : 'Сохранить вопрос с правильным ответом для разбора и перейти дальше'"
          @click="emit('unknown')"
        >
          {{ marked ? 'Отмечено' : 'Я не знаю' }}
        </button>
        <span class="text-xs text-slate-400">Вопрос {{ index + 1 }} из {{ total }}</span>
      </div>
    </header>

    <div class="md-content text-[1.02rem]" v-html="question.html" />

    <div v-if="question.choices.length" class="mt-5 space-y-2.5">
      <label
        v-for="choice in question.choices"
        :key="choice.id"
        class="flex items-start gap-3 rounded-xl border border-slate-200 p-3 transition has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50/60"
        :class="locked ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-indigo-300'"
      >
        <input
          class="peer sr-only"
          :type="question.type === 'single' ? 'radio' : 'checkbox'"
          :name="`q-${question.id}`"
          :checked="modelValue.includes(choice.id)"
          :disabled="locked"
          @change="toggleChoice(choice.id)"
        >
        <span
          class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-slate-300 bg-white transition peer-checked:border-indigo-500 peer-checked:bg-indigo-500"
          :class="question.type === 'single' ? 'rounded-full' : 'rounded-md'"
          aria-hidden="true"
        >
          <span
            v-if="modelValue.includes(choice.id)"
            class="bg-white"
            :class="question.type === 'single' ? 'h-2 w-2 rounded-full' : 'h-2.5 w-2.5 rounded-[3px]'"
          />
        </span>
        <span class="md-content min-w-0" v-html="choice.html" />
      </label>
    </div>

    <div v-else-if="question.type === 'input'" class="mt-5">
      <input
        :value="modelValue[0] ?? ''"
        :disabled="locked"
        type="text"
        autocomplete="off"
        placeholder="Введите ответ…"
        class="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:bg-slate-100 disabled:text-slate-500"
        @input="onTextInput"
      >
    </div>

    <p v-if="locked" class="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
      Время на вопрос вышло — ответ зафиксирован.
    </p>
  </article>
</template>
