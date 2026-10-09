<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)

const {
  phase,
  test,
  runQuestions,
  currentIndex,
  currentQuestion,
  currentAnswer,
  isLast,
  isLocked,
  canGoBack,
  hasTimer,
  isCurrentUnknown,
  results,
  totalScore,
  maxScore,
  answeredCount,
  progressPercent,
  timerTone,
  timerText,
  start,
  finish,
  goNext,
  goBack,
  setAnswer,
  markUnknown,
} = useTestRunner(slug)

useHead({ title: () => test.value?.title ?? 'Тест' })

const progressLabel = computed(() => {
  const index = currentIndex.value + 1
  const total = runQuestions.value.length
  if (!hasTimer.value) {
    return `Вопрос ${index} из ${total}`
  }
  if (test.value?.timer.mode === 'question') {
    return `Вопрос ${index} из ${total} · ${timerText.value}`
  }
  return `Осталось: ${timerText.value}`
})

function updateAnswer(value: string[]) {
  const question = currentQuestion.value
  if (question) {
    setAnswer(question.id, value)
  }
}

function confirmFinish() {
  if (window.confirm('Завершить тест досрочно? Неотвеченные вопросы получат 0 баллов.')) {
    finish()
  }
}
</script>

<template>
  <div>
    <div v-if="phase === 'loading'" class="animate-pulse space-y-4">
      <div class="h-8 w-2/3 rounded-lg bg-slate-200" />
      <div class="h-48 rounded-2xl bg-slate-200" />
    </div>

    <div v-else-if="phase === 'notfound'" class="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <p class="text-lg font-semibold text-slate-900">Тест не найден</p>
      <p class="mt-1 text-sm text-slate-500">Возможно, ссылка устарела или тест был удалён.</p>
      <NuxtLink to="/" class="mt-4 inline-block text-indigo-600 hover:underline">К списку тестов</NuxtLink>
    </div>

    <div v-else-if="phase === 'idle' && test" class="space-y-6">
      <header>
        <span class="text-xs font-medium uppercase tracking-wide text-indigo-600">{{ test.topic }}</span>
        <h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-900">{{ test.title }}</h1>
        <p v-if="test.description" class="mt-2 text-slate-600">{{ test.description }}</p>
      </header>

      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <dl class="grid gap-4 sm:grid-cols-3">
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-400">Вопросов</dt>
            <dd class="mt-1 text-lg font-semibold text-slate-900">{{ test.questions.length }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-400">Таймер</dt>
            <dd class="mt-1 text-lg font-semibold text-slate-900">{{ timerLabel(test.timer) }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-slate-400">Максимум баллов</dt>
            <dd class="mt-1 text-lg font-semibold text-slate-900">{{ test.questions.length * 2 }}</dd>
          </div>
        </dl>

        <ul class="mt-6 space-y-2 text-sm text-slate-600">
          <li>· Один правильный ответ: верно — 2 балла, неверно — 0.</li>
          <li>· Несколько ответов: всё верно — 2, часть без ошибок — 1, любая ошибка — 0.</li>
          <li>· Ввод ответа: точное совпадение — 2, частичное — 1, иначе — 0.</li>
          <li v-if="test.timer.mode === 'test'">
            · По истечении таймера тест завершится автоматически, неотвеченные вопросы получат 0.
          </li>
          <li v-if="test.timer.mode === 'question'">
            · Вопросы идут строго по порядку, назад вернуться нельзя. После истечения времени ответ фиксируется,
            но можно перейти к следующему вопросу.
          </li>
          <li>· При новом запуске вопросы и варианты перемешиваются, ответы и время сбрасываются.</li>
          <li>· Кнопка «Я не знаю» сохраняет вопрос с правильным ответом в список для разбора и переходит дальше (0 баллов).</li>
        </ul>

        <button
          class="mt-8 w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-indigo-700 sm:w-auto"
          @click="start"
        >
          Начать тест
        </button>
      </section>
    </div>

    <div v-else-if="phase === 'running' && test && currentQuestion" class="space-y-6">
      <div class="sticky top-14 z-20 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8">
        <TimerBar :label="progressLabel" :percent="progressPercent" :tone="timerTone">
          <template #aside>
            <span class="text-xs text-slate-400">Отвечено {{ answeredCount }} из {{ runQuestions.length }}</span>
          </template>
        </TimerBar>
      </div>

      <QuestionCard
        :question="currentQuestion"
        :index="currentIndex"
        :total="runQuestions.length"
        :model-value="currentAnswer"
        :locked="isLocked"
        :marked="isCurrentUnknown"
        @update:model-value="updateAnswer"
        @unknown="markUnknown"
      />

      <div class="flex items-center justify-between gap-3">
        <button
          v-if="canGoBack"
          class="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          @click="goBack"
        >
          Назад
        </button>
        <span v-else />

        <div class="flex items-center gap-4">
          <button
            v-if="test.timer.mode === 'test'"
            class="text-sm text-slate-400 transition hover:text-slate-600"
            @click="confirmFinish"
          >
            Завершить досрочно
          </button>
          <button
            class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            @click="goNext"
          >
            {{ isLast ? 'Завершить тест' : 'Далее' }}
          </button>
        </div>
      </div>
    </div>

    <ResultsView
      v-else-if="phase === 'finished' && test"
      :results="results"
      :total-score="totalScore"
      :max-score="maxScore"
      :test-title="test.title"
      @retry="start"
    />
  </div>
</template>
