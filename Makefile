COMPOSE ?= docker compose
BASE_URL ?= /

.PHONY: help install dev down logs build preview lint typecheck test shell clean

help: ## Показать список команд
	@echo "Доступные команды:"
	@echo "  make install    установить зависимости внутри контейнера"
	@echo "  make dev        dev-сервер на http://localhost:3000"
	@echo "  make build      статическая сборка в .output/public (BASE_URL=/repo/ для GitHub Pages)"
	@echo "  make preview    предпросмотр сборки на http://localhost:8080"
	@echo "  make lint       eslint внутри контейнера"
	@echo "  make typecheck  проверка типов внутри контейнера"
	@echo "  make test       vitest внутри контейнера"
	@echo "  make shell      shell внутри контейнера"
	@echo "  make clean      удалить контейнеры, volume и артефакты"

install: ## Установить зависимости
	$(COMPOSE) build dev
	$(COMPOSE) run --rm dev npm ci

dev: ## Запустить dev-сервер
	$(COMPOSE) up dev

down: ## Остановить контейнеры
	$(COMPOSE) down

logs: ## Логи dev-сервера
	$(COMPOSE) logs -f dev

build: ## Собрать статический сайт
	$(COMPOSE) run --rm -e NUXT_APP_BASE_URL=$(BASE_URL) build

preview: ## Предпросмотр статической сборки
	$(COMPOSE) up -d --force-recreate preview
	@echo "Предпросмотр: http://localhost:8080"

lint: ## ESLint
	$(COMPOSE) run --rm dev npm run lint

typecheck: ## Проверка типов
	$(COMPOSE) run --rm dev npm run typecheck

test: ## Юнит-тесты
	$(COMPOSE) run --rm dev npm test

shell: ## Shell в контейнере
	$(COMPOSE) run --rm dev sh

clean: ## Очистка
	$(COMPOSE) down -v --remove-orphans
	rm -rf .nuxt .output node_modules
