import type { TestDefinition } from './types.ts'

export function validateTest(test: TestDefinition): void {
  const where = `[${test.slug}]`

  if (!/^[a-z0-9][a-z0-9-]*$/.test(test.slug)) {
    throw new Error(`${where} имя файла должно содержать только строчные латинские буквы, цифры и дефис`)
  }
  if (!test.title) {
    throw new Error(`${where} не заполнено поле title`)
  }
  if (!test.topic) {
    throw new Error(`${where} не заполнено поле topic`)
  }

  const { timer } = test
  if (!['none', 'test', 'question'].includes(timer.mode)) {
    throw new Error(`${where} неизвестный режим таймера "${timer.mode}"`)
  }
  if (timer.mode === 'test' && (!Number.isInteger(timer.seconds) || (timer.seconds ?? 0) <= 0)) {
    throw new Error(`${where} для таймера на тест нужно указать timer.seconds > 0`)
  }
  if (timer.mode === 'question' && (!Number.isInteger(timer.perQuestion) || (timer.perQuestion ?? 0) <= 0)) {
    throw new Error(`${where} для таймера на вопрос нужно указать timer.perQuestion > 0`)
  }

  if (test.questions.length === 0) {
    throw new Error(`${where} не найдено ни одного блока :::question`)
  }

  test.questions.forEach((question, index) => {
    const label = `${where} вопрос ${index + 1}`
    if (!['single', 'multiple', 'input'].includes(question.type)) {
      throw new Error(`${label}: неизвестный тип "${question.type || '(пусто)'}", ожидается single | multiple | input`)
    }

    const correctCount = question.choices.filter(choice => choice.correct).length
    if (question.type === 'single') {
      if (question.choices.length < 2) {
        throw new Error(`${label}: нужно минимум 2 варианта ответа`)
      }
      if (correctCount !== 1) {
        throw new Error(`${label}: для типа single должен быть ровно один правильный вариант, найдено ${correctCount}`)
      }
    }
    if (question.type === 'multiple') {
      if (question.choices.length < 2) {
        throw new Error(`${label}: нужно минимум 2 варианта ответа`)
      }
      if (correctCount < 1) {
        throw new Error(`${label}: для типа multiple нужен хотя бы один правильный вариант`)
      }
    }
    if (question.type === 'input') {
      if (question.choices.length > 0) {
        throw new Error(`${label}: для типа input варианты ответа недопустимы`)
      }
      if (question.accepted.length + question.partial.length === 0) {
        throw new Error(`${label}: для типа input нужен блок :::accepted или :::partial`)
      }
    }

    question.partial.forEach((pattern) => {
      try {
        new RegExp(pattern, 'iu')
      }
      catch {
        throw new Error(`${label}: некорректное регулярное выражение в :::partial — ${pattern}`)
      }
    })
  })
}
