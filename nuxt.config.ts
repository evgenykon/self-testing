import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

function generatedTestRoutes(): string[] {
  try {
    const path = fileURLToPath(new URL('./app/generated/tests.json', import.meta.url))
    const entries = JSON.parse(readFileSync(path, 'utf8')) as { slug: string }[]
    return entries.map(entry => `/tests/${entry.slug}`)
  }
  catch {
    return []
  }
}

export default defineNuxtConfig({
  compatibilityDate: '2026-10-07',
  future: {
    compatibilityVersion: 5,
  },
  devtools: {
    enabled: false,
  },
  ssr: true,
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'Self Testing',
      titleTemplate: '%s — Self Testing',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Сборник тестов по разным темам: одиночный выбор, несколько вариантов, ввод ответа, таймеры и разбор результатов' },
      ],
    },
  },
  css: ['katex/dist/katex.min.css', '~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {
      stylistic: false,
    },
  },
  prerender: {
    crawlLinks: true,
    routes: ['/', ...generatedTestRoutes()],
  },
  experimental: {
    payloadExtraction: false,
  },
  typescript: {
    strict: true,
  },
})
