<script setup lang="ts">
useHead({ title: 'Справочные таблицы' })

interface SinRow {
  deg: string
  rad: string
  sin: string
}

interface LogRow {
  n: string
  lg: string
  ln: string
}

interface PairRow {
  first: string
  second: string
}

const toc = [
  { id: 'sinus', title: 'Таблица синусов' },
  { id: 'logarithms', title: 'Таблица логарифмов' },
  { id: 'derivatives', title: 'Таблица производных' },
  { id: 'integrals', title: 'Таблица интегралов' },
]

const sinRows: SinRow[] = [
  { deg: '0°', rad: '0', sin: '0' },
  { deg: '30°', rad: '\\dfrac{\\pi}{6}', sin: '\\dfrac{1}{2}' },
  { deg: '45°', rad: '\\dfrac{\\pi}{4}', sin: '\\dfrac{\\sqrt{2}}{2}' },
  { deg: '60°', rad: '\\dfrac{\\pi}{3}', sin: '\\dfrac{\\sqrt{3}}{2}' },
  { deg: '90°', rad: '\\dfrac{\\pi}{2}', sin: '1' },
  { deg: '120°', rad: '\\dfrac{2\\pi}{3}', sin: '\\dfrac{\\sqrt{3}}{2}' },
  { deg: '135°', rad: '\\dfrac{3\\pi}{4}', sin: '\\dfrac{\\sqrt{2}}{2}' },
  { deg: '150°', rad: '\\dfrac{5\\pi}{6}', sin: '\\dfrac{1}{2}' },
  { deg: '180°', rad: '\\pi', sin: '0' },
  { deg: '210°', rad: '\\dfrac{7\\pi}{6}', sin: '-\\dfrac{1}{2}' },
  { deg: '225°', rad: '\\dfrac{5\\pi}{4}', sin: '-\\dfrac{\\sqrt{2}}{2}' },
  { deg: '240°', rad: '\\dfrac{4\\pi}{3}', sin: '-\\dfrac{\\sqrt{3}}{2}' },
  { deg: '270°', rad: '\\dfrac{3\\pi}{2}', sin: '-1' },
  { deg: '300°', rad: '\\dfrac{5\\pi}{3}', sin: '-\\dfrac{\\sqrt{3}}{2}' },
  { deg: '315°', rad: '\\dfrac{7\\pi}{4}', sin: '-\\dfrac{\\sqrt{2}}{2}' },
  { deg: '330°', rad: '\\dfrac{11\\pi}{6}', sin: '-\\dfrac{1}{2}' },
  { deg: '360°', rad: '2\\pi', sin: '0' },
]

const logRows: LogRow[] = [
  { n: '1', lg: '0', ln: '0' },
  { n: '2', lg: '0.3010', ln: '0.6931' },
  { n: '3', lg: '0.4771', ln: '1.0986' },
  { n: '4', lg: '0.6021', ln: '1.3863' },
  { n: '5', lg: '0.6990', ln: '1.6094' },
  { n: '6', lg: '0.7782', ln: '1.7918' },
  { n: '7', lg: '0.8451', ln: '1.9459' },
  { n: '8', lg: '0.9031', ln: '2.0794' },
  { n: '9', lg: '0.9542', ln: '2.1972' },
  { n: '10', lg: '1', ln: '2.3026' },
]

const derivativeRows: PairRow[] = [
  { first: 'c', second: '0' },
  { first: 'x', second: '1' },
  { first: 'x^n', second: 'n x^{n-1}' },
  { first: '\\sqrt{x}', second: '\\dfrac{1}{2\\sqrt{x}}' },
  { first: '\\dfrac{1}{x}', second: '-\\dfrac{1}{x^2}' },
  { first: '\\sin x', second: '\\cos x' },
  { first: '\\cos x', second: '-\\sin x' },
  { first: '\\tg x', second: '\\dfrac{1}{\\cos^2 x}' },
  { first: '\\ctg x', second: '-\\dfrac{1}{\\sin^2 x}' },
  { first: 'e^x', second: 'e^x' },
  { first: 'a^x', second: 'a^x \\ln a' },
  { first: '\\ln x', second: '\\dfrac{1}{x}' },
  { first: '\\log_a x', second: '\\dfrac{1}{x \\ln a}' },
  { first: '\\arcsin x', second: '\\dfrac{1}{\\sqrt{1 - x^2}}' },
  { first: '\\arccos x', second: '-\\dfrac{1}{\\sqrt{1 - x^2}}' },
  { first: '\\arctg x', second: '\\dfrac{1}{1 + x^2}' },
  { first: '\\arcctg x', second: '-\\dfrac{1}{1 + x^2}' },
]

const integralRows: PairRow[] = [
  { first: '\\int 0\\,dx', second: 'C' },
  { first: '\\int x^n\\,dx', second: '\\dfrac{x^{n+1}}{n+1} + C \\ (n \\neq -1)' },
  { first: '\\int \\dfrac{dx}{x}', second: '\\ln |x| + C' },
  { first: '\\int e^x\\,dx', second: 'e^x + C' },
  { first: '\\int a^x\\,dx', second: '\\dfrac{a^x}{\\ln a} + C' },
  { first: '\\int \\sin x\\,dx', second: '-\\cos x + C' },
  { first: '\\int \\cos x\\,dx', second: '\\sin x + C' },
  { first: '\\int \\dfrac{dx}{\\cos^2 x}', second: '\\tg x + C' },
  { first: '\\int \\dfrac{dx}{\\sin^2 x}', second: '-\\ctg x + C' },
  { first: '\\int \\dfrac{dx}{\\sqrt{a^2 - x^2}}', second: '\\arcsin \\dfrac{x}{a} + C' },
  { first: '\\int \\dfrac{dx}{a^2 + x^2}', second: '\\dfrac{1}{a} \\arctg \\dfrac{x}{a} + C' },
  { first: '\\int \\dfrac{dx}{x^2 - a^2}', second: '\\dfrac{1}{2a} \\ln \\left| \\dfrac{x - a}{x + a} \\right| + C' },
]
</script>

<template>
  <div class="space-y-8">
    <header>
      <h1 class="text-3xl font-bold tracking-tight text-slate-900">Справочные таблицы</h1>
      <p class="mt-2 max-w-2xl text-slate-600">
        Часто используемые значения и формулы: тригонометрия, логарифмы, производные и интегралы.
        Удобно держать под рукой при прохождении тестов.
      </p>
    </header>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 class="text-lg font-semibold text-slate-900">Оглавление</h2>
      <ul class="mt-4 grid gap-2 sm:grid-cols-2">
        <li v-for="(item, index) in toc" :key="item.id">
          <a
            :href="`#${item.id}`"
            class="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
              {{ index + 1 }}
            </span>
            {{ item.title }}
          </a>
        </li>
      </ul>
    </section>

    <section id="sinus" class="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 class="text-xl font-semibold text-slate-900">Таблица синусов</h2>
      <p class="mt-1.5 text-sm text-slate-500">Точные значения синуса основных углов.</p>
      <div class="md-content mt-4 overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="w-1/3 text-left">Угол</th>
              <th class="w-1/3 text-left">Радианы</th>
              <th class="text-left">sin α</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sinRows" :key="row.deg">
              <td>{{ row.deg }}</td>
              <td><MathTex :tex="row.rad" /></td>
              <td><MathTex :tex="row.sin" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="logarithms" class="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 class="text-xl font-semibold text-slate-900">Таблица логарифмов</h2>
      <p class="mt-1.5 text-sm text-slate-500">
        Десятичный (lg) и натуральный (ln) логарифмы чисел от 1 до 10.
      </p>
      <div class="md-content mt-4 overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="w-1/3 text-left">n</th>
              <th class="w-1/3 text-left">lg n</th>
              <th class="text-left">ln n</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in logRows" :key="row.n">
              <td>{{ row.n }}</td>
              <td><MathTex :tex="row.lg" /></td>
              <td><MathTex :tex="row.ln" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="derivatives" class="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 class="text-xl font-semibold text-slate-900">Таблица производных</h2>
      <p class="mt-1.5 text-sm text-slate-500">Производные основных элементарных функций.</p>
      <div class="md-content mt-4 overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="w-1/2 text-left">Функция</th>
              <th class="text-left">Производная</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in derivativeRows" :key="index">
              <td><MathTex :tex="row.first" /></td>
              <td><MathTex :tex="row.second" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="integrals" class="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 class="text-xl font-semibold text-slate-900">Таблица интегралов</h2>
      <p class="mt-1.5 text-sm text-slate-500">Таблица основных неопределённых интегралов.</p>
      <div class="md-content mt-4 overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="w-1/2 text-left">Интеграл</th>
              <th class="text-left">Первообразная</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in integralRows" :key="index">
              <td><MathTex :tex="row.first" /></td>
              <td><MathTex :tex="row.second" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>