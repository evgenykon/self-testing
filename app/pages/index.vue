<script setup lang="ts">
const { topics, tests, totalQuestions } = useTestsIndex()

useHead({ title: 'Все тесты' })
</script>

<template>
  <div class="space-y-10">
    <header>
      <h1 class="text-3xl font-bold tracking-tight text-slate-900">Тесты</h1>
      <p class="mt-2 max-w-2xl text-slate-600">
        Выберите тему и проверьте себя. Вопросы и варианты ответов перемешиваются при каждом запуске,
        а после прохождения вы увидите разбор и баллы.
      </p>
      <p v-if="tests.length" class="mt-2 text-sm text-slate-400">
        {{ tests.length }} {{ plural(tests.length, 'тест', 'теста', 'тестов') }}
        · {{ totalQuestions }} {{ plural(totalQuestions, 'вопрос', 'вопроса', 'вопросов') }}
      </p>
    </header>

    <section v-for="topic in topics" :key="topic.name" class="space-y-4">
      <h2 class="flex items-center gap-2 text-xl font-semibold text-slate-900">
        {{ topic.name }}
        <span class="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
          {{ topic.tests.length }}
        </span>
      </h2>
      <div class="grid gap-4 sm:grid-cols-2">
        <TestCard v-for="test in topic.tests" :key="test.slug" :test="test" />
      </div>
    </section>

    <p
      v-if="!tests.length"
      class="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500"
    >
      Тесты пока не добавлены. Создайте markdown-файл в <code class="rounded bg-slate-100 px-1.5 py-0.5">content/tests</code>.
    </p>
  </div>
</template>
