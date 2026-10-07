---
title: Основы JavaScript
topic: Программирование
description: Типы данных, методы массивов и асинхронность
timer:
  mode: test
  seconds: 600
---

:::question{type=single}
Что вернёт выражение `typeof null`?

- [ ] `"null"`
- [x] `"object"`
- [ ] `"undefined"`

:::explanation
Это историческая особенность языка: `typeof null === "object"`.
:::
:::

:::question{type=multiple}
Какие методы **не мутируют** исходный массив?

- [x] `map`
- [ ] `push`
- [x] `filter`
- [ ] `splice`
:::

:::question{type=input}
Каким ключевым словом объявляется константа в современном JavaScript?

:::accepted
const
:::

:::partial
^const$
:::
:::

:::question{type=single}
![Схема](./assets/event-loop.svg)

Что изображено на схеме?

- [x] Цикл событий (event loop)
- [ ] Стек вызовов
- [ ] Очередь микрозадач
:::
