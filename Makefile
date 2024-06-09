dev:
	npm run start:dev

lint:
	npm run lint
	npm run format

test:
	npm run test

e2e:
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
	docker run -p 3001:3001 movies-api
