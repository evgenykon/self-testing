<script setup lang="ts">
import type { QuestionResult, RuntimeQuestion } from '~/lib/test-types'

const props = defineProps<{
  results: QuestionResult[]
  totalScore: number
  maxScore: number
  testTitle: string
}>()

const emit = defineEmits<{ retry: [] }>()

const percent = computed(() => (props.maxScore > 0 ? Math.round((props.totalScore / props.maxScore) * 100) : 0))

function choiceHtml(question: RuntimeQuestion, id: string): string {
  return question.choices.find(choice => choice.id === id)?.html ?? ''
}

function selectedHtmls(item: QuestionResult): string[] {
  return item.selected.map(id => choiceHtml(item.question, id))
}

function correctHtmls(item: QuestionResult): string[] {
  return item.correctIds.map(id => choiceHtml(item.question, id))
}
</script>

<template>
  <div class="space-y-6">
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p class="text-sm font-medium uppercase tracking-wide text-indigo-600">Результат</p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900">{{ testTitle }}</h1>
          <p class="mt-2 text-slate-600">
            <span class="text-3xl font-bold text-slate-900">{{ totalScore }}</span>
            <span class="text-slate-400"> / {{ maxScore }} баллов</span>
            <span class="ml-2 rounded-full bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-600">{{ percent }}%</span>
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            @click="emit('retry')"
          >
            Пройти заново
          </button>
          <NuxtLink
            to="/"
            class="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            К списку тестов
          </NuxtLink>
        </div>
      </div>
    </section>

    <article
      v-for="(item, index) in results"
      :key="item.question.id"
      class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <header class="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2 text-sm text-slate-500">
          <span class="font-semibold text-slate-700">Вопрос {{ index + 1 }}</span>
          <span>·</span>
          <span>{{ questionTypeLabel(item.question.type) }}</span>
        </div>
        <ScoreBadge :score="item.score" />
      </header>

      <div class="md-content" v-html="item.question.html" />

      <div class="mt-4 space-y-3 text-sm">
        <div class="rounded-xl bg-slate-50 p-3">
          <p class="mb-1 font-medium text-slate-500">Ваш ответ</p>
          <template v-if="item.question.type === 'input'">
            <p v-if="item.answerText" class="md-content">{{ item.answerText }}</p>
            <p v-else class="text-slate-400">Нет ответа</p>
          </template>
          <template v-else>
            <ul v-if="selectedHtmls(item).length" class="space-y-1">
              <li v-for="(html, choiceIndex) in selectedHtmls(item)" :key="choiceIndex" class="md-content" v-html="html" />
            </ul>
            <p v-else class="text-slate-400">Нет ответа</p>
          </template>
        </div>

        <div class="rounded-xl bg-emerald-50 p-3">
          <p class="mb-1 font-medium text-emerald-700">Правильный ответ</p>
          <template v-if="item.question.type === 'input'">
            <p class="md-content">{{ item.question.accepted.join(' / ') || '—' }}</p>
          </template>
          <template v-else>
            <ul class="space-y-1">
              <li v-for="(html, choiceIndex) in correctHtmls(item)" :key="choiceIndex" class="md-content" v-html="html" />
            </ul>
          </template>
        </div>

        <div v-if="item.question.explanationHtml" class="rounded-xl border border-slate-200 p-3">
          <p class="mb-1 font-medium text-slate-500">Разбор</p>
          <div class="md-content" v-html="item.question.explanationHtml" />
        </div>
      </div>
    </article>
  </div>
</template>
