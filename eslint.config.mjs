import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      'app/generated/**',
      'public/tests-assets/**',
      '.output/**',
      '.nuxt/**',
      'node_modules/**',
    ],
  },
  {
    // HTML собирается на этапе сборки из markdown с html: false, поэтому v-html безопасен
    files: ['app/components/QuestionCard.vue', 'app/components/ResultsView.vue', 'app/pages/review.vue'],
    rules: {
      'vue/no-v-html': 'off',
    },
  },
)
