<script setup lang="ts">
import type { UnknownQuestionRecord } from '~/lib/test-types'

useHead({ title: 'Вопросы для разбора' })

const { items, ready, unmark, clearAll } = useUnknownQuestions()

const groups = computed(() => {
  const map = new Map<string, { slug: string, title: string, items: UnknownQuestionRecord[] }>()
  for (const item of [...items.value].sort((a, b) => b.markedAt - a.markedAt)) {
    const group = map.get(item.slug) ?? { slug: item.slug, title: item.testTitle, items: [] }
    group.items.push(item)
    map.set(item.slug, group)
  }
  return [...map.values()]
})

function confirmClear() {
  if (window.confirm('Убрать все вопросы из списка разбора?')) {
    clearAll()
  }
}
</script>

<template>
  <div class="space-y-8">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Вопросы для разбора</h1>
        <p class="mt-2 max-w-2xl text-slate-600">
          Сюда попадают вопросы, отмеченные во время теста кнопкой «Я не знаю». Здесь виден правильный
          ответ и разбор — чтобы вернуться к теме и закрыть пробел.
        </p>
      </div>
      <button
        v-if="ready && items.length > 0"
        class="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        @click="confirmClear"
      >
        Очистить список
      </button>
    </header>

    <div v-if="!ready" class="animate-pulse space-y-4">
      <div class="h-40 rounded-2xl bg-slate-200" />
      <div class="h-40 rounded-2xl bg-slate-200" />
    </div>

    <div v-else-if="items.length === 0" class="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
      <p class="text-slate-500">
        Пока пусто. Во время теста нажмите «Я не знаю» — вопрос с правильным ответом появится здесь.
      </p>
      <NuxtLink to="/" class="mt-4 inline-block text-indigo-600 hover:underline">К списку тестов</NuxtLink>
    </div>

    <template v-else>
      <section v-for="group in groups" :key="group.slug" class="space-y-4">
        <h2 class="flex flex-wrap items-center gap-2 text-xl font-semibold text-slate-900">
          <NuxtLink :to="`/tests/${group.slug}`" class="transition hover:text-indigo-700">
            {{ group.title }}
          </NuxtLink>
          <span class="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {{ group.items.length }}
          </span>
        </h2>

        <article
          v-for="item in group.items"
          :key="item.key"
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <header class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <span class="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                {{ questionTypeLabel(item.type) }}
              </span>
              <span>Отмечен {{ formatDateTime(item.markedAt) }}</span>
            </div>
            <button
              class="text-xs font-medium text-slate-400 transition hover:text-red-600"
              @click="unmark(item.slug, item.questionId)"
            >
              Убрать
            </button>
          </header>

          <div class="md-content text-[1.02rem]" v-html="item.questionHtml" />

          <div class="mt-4 space-y-3 text-sm">
            <div class="rounded-xl bg-emerald-50 p-3">
              <p class="mb-1 font-medium text-emerald-700">Правильный ответ</p>
              <template v-if="item.type === 'input'">
                <p class="md-content">{{ item.accepted.join(' / ') || '—' }}</p>
              </template>
              <template v-else>
                <ul class="space-y-1">
                  <li v-for="(html, choiceIndex) in item.correctHtmls" :key="choiceIndex" class="md-content" v-html="html" />
                </ul>
              </template>
            </div>

            <div v-if="item.explanationHtml" class="rounded-xl border border-slate-200 p-3">
              <p class="mb-1 font-medium text-slate-500">Разбор</p>
              <div class="md-content" v-html="item.explanationHtml" />
            </div>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>
