<script setup lang="ts">
import type { AttemptRecord } from '~/lib/test-types'

useHead({ title: 'Результаты' })

const { attempts, ready, clearAttempts } = useAttempts()

const groups = computed(() => groupAttempts(attempts.value))
const totalAttempts = computed(() => attempts.value.length)
const average = computed(() => averagePercent(attempts.value))
const best = computed(() => (attempts.value.length > 0 ? Math.max(...attempts.value.map(attempt => attempt.percent)) : 0))

function chartPoints(list: AttemptRecord[]) {
  return list.slice(-20).map(attempt => ({
    x: attempt.finishedAt,
    y: attempt.percent,
    label: `${formatDateTime(attempt.finishedAt)} · ${attempt.score}/${attempt.maxScore} (${attempt.percent}%)`,
  }))
}

function confirmReset() {
  if (window.confirm('Удалить всю историю результатов? Это действие нельзя отменить.')) {
    clearAttempts()
  }
}
</script>

<template>
  <div class="space-y-8">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Результаты</h1>
        <p class="mt-2 max-w-2xl text-slate-600">
          История попыток хранится в этом браузере. График показывает процент набранных баллов
          от максимума по каждой попытке.
        </p>
      </div>
      <button
        v-if="ready && totalAttempts > 0"
        class="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
        @click="confirmReset"
      >
        Сбросить результаты
      </button>
    </header>

    <div v-if="!ready" class="animate-pulse space-y-4">
      <div class="h-28 rounded-2xl bg-slate-200" />
      <div class="h-64 rounded-2xl bg-slate-200" />
    </div>

    <div v-else-if="totalAttempts === 0" class="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
      <p class="text-slate-500">Пока нет ни одной завершённой попытки. Пройдите любой тест — результат появится здесь.</p>
      <NuxtLink to="/" class="mt-4 inline-block text-indigo-600 hover:underline">К списку тестов</NuxtLink>
    </div>

    <template v-else>
      <section class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-xs uppercase tracking-wide text-slate-400">Попыток</p>
          <p class="mt-1 text-2xl font-bold text-slate-900">{{ totalAttempts }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-xs uppercase tracking-wide text-slate-400">Средний результат</p>
          <p class="mt-1 text-2xl font-bold text-slate-900">{{ average }}%</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-xs uppercase tracking-wide text-slate-400">Лучший результат</p>
          <p class="mt-1 text-2xl font-bold text-emerald-600">{{ best }}%</p>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 class="text-lg font-semibold text-slate-900">Сравнение тестов</h2>
        <p class="mt-1 text-sm text-slate-500">Лучший результат по каждому тесту.</p>
        <div class="mt-5 space-y-4">
          <div v-for="group in groups" :key="group.slug">
            <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
              <NuxtLink :to="`/tests/${group.slug}`" class="font-medium text-slate-800 transition hover:text-indigo-700">
                {{ group.title }}
              </NuxtLink>
              <span class="text-slate-500">
                Лучший {{ group.best }}% · Последний {{ group.last }}%
              </span>
            </div>
            <div class="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-indigo-500" :style="{ width: `${group.best}%` }" />
            </div>
          </div>
        </div>
      </section>

      <section
        v-for="group in groups"
        :key="group.slug"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <header class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <NuxtLink :to="`/tests/${group.slug}`" class="text-lg font-semibold text-slate-900 transition hover:text-indigo-700">
              {{ group.title }}
            </NuxtLink>
            <p class="mt-1 text-sm text-slate-500">
              {{ group.attempts.length }} {{ plural(group.attempts.length, 'попытка', 'попытки', 'попыток') }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2 text-xs font-medium">
            <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Лучший {{ group.best }}%</span>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">Средний {{ group.average }}%</span>
            <span class="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">Последний {{ group.last }}%</span>
          </div>
        </header>

        <div class="mt-5">
          <AttemptsChart :points="chartPoints(group.attempts)" />
          <div class="mt-1 flex justify-between text-xs text-slate-400">
            <span>{{ formatDateTime(group.attempts[0]!.finishedAt) }}</span>
            <span v-if="group.attempts.length > 1">
              {{ formatDateTime(group.attempts[group.attempts.length - 1]!.finishedAt) }}
            </span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
