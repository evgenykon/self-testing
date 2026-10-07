import { scoreInput, scoreMultiple, scoreSingle, type Score } from '#shared/scoring'
import { shuffle } from '#shared/shuffle'
import { loadTest } from '~/lib/loader'
import type { QuestionResult, RuntimeQuestion, RuntimeTest } from '~/lib/test-types'

export type RunnerPhase = 'loading' | 'idle' | 'running' | 'finished' | 'notfound'

export function useTestRunner(slug: string) {
  const phase = ref<RunnerPhase>('loading')
  const test = ref<RuntimeTest | null>(null)
  const runQuestions = ref<RuntimeQuestion[]>([])
  const currentIndex = ref(0)
  const answers = ref<Record<string, string[]>>({})
  const locked = ref<Record<string, boolean>>({})
  const remainingMs = ref(0)
  const totalMs = ref(0)

  let timerId: ReturnType<typeof setInterval> | null = null
  let deadline = 0

  onMounted(async () => {
    const loaded = await loadTest(slug)
    if (!loaded) {
      phase.value = 'notfound'
      return
    }
    test.value = loaded
    phase.value = 'idle'
  })

  onBeforeUnmount(clearTimer)

  function clearTimer() {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  }

  function arm(ms: number) {
    clearTimer()
    totalMs.value = ms
    remainingMs.value = ms
    deadline = Date.now() + ms
    timerId = setInterval(() => {
      const left = deadline - Date.now()
      remainingMs.value = Math.max(0, left)
      if (left <= 0) {
        handleTimeout()
      }
    }, 200)
  }

  function handleTimeout() {
    clearTimer()
    remainingMs.value = 0
    if (test.value?.timer.mode === 'test') {
      finish()
      return
    }
    const question = currentQuestion.value
    if (question) {
      locked.value = { ...locked.value, [question.id]: true }
    }
  }

  function start() {
    const loaded = test.value
    if (!loaded) {
      return
    }
    runQuestions.value = (loaded.shuffleQuestions ? shuffle(loaded.questions) : [...loaded.questions])
      .map(question => ({
        ...question,
        choices: loaded.shuffleAnswers ? shuffle(question.choices) : [...question.choices],
      }))
    answers.value = {}
    locked.value = {}
    currentIndex.value = 0
    phase.value = 'running'
    if (loaded.timer.mode === 'test') {
      arm((loaded.timer.seconds ?? 0) * 1000)
    }
    else if (loaded.timer.mode === 'question') {
      arm((loaded.timer.perQuestion ?? 0) * 1000)
    }
    else {
      clearTimer()
      totalMs.value = 0
      remainingMs.value = 0
    }
  }

  function finish() {
    clearTimer()
    phase.value = 'finished'
  }

  function goNext() {
    if (isLast.value) {
      finish()
      return
    }
    currentIndex.value++
    if (test.value?.timer.mode === 'question') {
      arm((test.value.timer.perQuestion ?? 0) * 1000)
    }
  }

  function goBack() {
    if (canGoBack.value) {
      currentIndex.value--
    }
  }

  function setAnswer(questionId: string, value: string[]) {
    if (locked.value[questionId]) {
      return
    }
    answers.value = { ...answers.value, [questionId]: value }
  }

  const currentQuestion = computed(() => runQuestions.value[currentIndex.value] ?? null)
  const currentAnswer = computed(() => {
    const question = currentQuestion.value
    return question ? (answers.value[question.id] ?? []) : []
  })
  const isLast = computed(() => runQuestions.value.length > 0 && currentIndex.value === runQuestions.value.length - 1)
  const isLocked = computed(() => {
    const question = currentQuestion.value
    return question ? locked.value[question.id] === true : false
  })
  const canGoBack = computed(() => test.value?.timer.mode !== 'question' && currentIndex.value > 0)
  const hasTimer = computed(() => test.value?.timer.mode === 'test' || test.value?.timer.mode === 'question')

  const results = computed<QuestionResult[]>(() => runQuestions.value.map((question) => {
    const selected = answers.value[question.id] ?? []
    const correctIds = test.value?.correct[question.id] ?? []
    let score: Score
    if (question.type === 'single') {
      score = scoreSingle(selected[0], correctIds[0])
    }
    else if (question.type === 'multiple') {
      score = scoreMultiple(selected, correctIds)
    }
    else {
      score = scoreInput(selected[0] ?? '', question.accepted, question.partial)
    }
    return {
      question,
      selected: question.type === 'input' ? [] : selected,
      answerText: question.type === 'input' ? (selected[0] ?? '') : '',
      score,
      correctIds,
    }
  }))

  const totalScore = computed(() => results.value.reduce((sum, item) => sum + item.score, 0))
  const maxScore = computed(() => runQuestions.value.length * 2)
  const answeredCount = computed(() => runQuestions.value.filter(question => (answers.value[question.id]?.length ?? 0) > 0).length)

  const progressPercent = computed(() => {
    if (phase.value !== 'running') {
      return 0
    }
    if (hasTimer.value && totalMs.value > 0) {
      return Math.max(0, Math.min(100, (remainingMs.value / totalMs.value) * 100))
    }
    if (runQuestions.value.length === 0) {
      return 0
    }
    return ((currentIndex.value + 1) / runQuestions.value.length) * 100
  })

  const timerTone = computed<'brand' | 'warn' | 'danger'>(() => {
    if (!hasTimer.value || totalMs.value === 0) {
      return 'brand'
    }
    const ratio = remainingMs.value / totalMs.value
    if (ratio > 0.5) {
      return 'brand'
    }
    if (ratio > 0.2) {
      return 'warn'
    }
    return 'danger'
  })

  const timerText = computed(() => {
    if (!hasTimer.value) {
      return ''
    }
    return formatClock(remainingMs.value)
  })

  return {
    phase,
    test,
    runQuestions,
    currentIndex,
    currentQuestion,
    currentAnswer,
    answers,
    locked,
    remainingMs,
    totalMs,
    isLast,
    isLocked,
    canGoBack,
    hasTimer,
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
  }
}
