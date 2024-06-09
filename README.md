Running:

1) use a node version manager (nvm is reccomended)
2) $nvm use
3) $npm i
4) ask for .env form the team
5) npm run start:dev

Patterns:

- We use Roles Guard to authenticate and authorize the apis. guards/decorators.ts has the neccesery decorators to be used for guard.
- On login, we use nestjs/jwt to create a jwt token, and assert it on roles guard.
- We use class validators in dto files as annotations to do input validation.
- We use swagger on /api endpoint, you can create a token trough calling login and put it in the Bearer action on the top right of the swagger page.
- For ORM we use Prisma. You can edit the schema file and call 'make generate' to apply the changes to nodejs.
- Use 'make unit-tests' and 'make e2e-tests' to run tests.

questions:
- refresh token de ekleyelim mi?
- TODO: seperate user from profile
- hash the password at the client level?
- session start-end times may be enum
- ayrı tablolar mı yapalım, relationları movies içinde mi yapalım
- soru: aynı movie-session mı booklanamasın sadece session mı?
