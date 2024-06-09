dev:
	npm run dev

build:
	npm run build

lint:
	npm run lint
	npm run format

unit-tests:
	npm run test

e2e-tests:
	npm run test:e2e

verify:
	npm run lint
	npm run build
	npm run test
	npm run test:e2e

generate:
	npx prisma generate

build_docker:
	docker build -t movies-api .

run_docker:
	docker run -p 3001:3001 --name movies-api -d movies-api

stop_docker:
	docker stop movies-api || true
	docker rm movies-api || true

restart_docker:
	docker stop movies-api || true
	docker rm movies-api || true
	docker run -p 3001:3001 --name movies-api -d movies-api
