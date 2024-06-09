Running:

1) use a node version manager (nvm is reccomended)
2) $ nvm use
3) $ npm i
4) ask for .env file from the team
5) $ npm run start:dev
6) Navigate to http://localhost:3001/api

Patterns:

- We use Roles Guard to authenticate and authorize the apis. guards/decorators.ts has the neccesery decorators to be used for the controller classes.
- On login, we use nestjs/jwt to create a jwt token, and assert the token exists on the request in roles guard.
- We use class validators in dto files as annotations to do input validation.
- We use swagger on /api endpoint. To be able to authenticate, you can first get an access token trough calling the login endpoint, then put the 'Bearer token' string inside the 'Authorize' button action on the top right of the swagger page.
- For ORM we use Prisma. You can edit the schema file and call 'make generate' to apply the changes to nodejs.
- Use 'make unit-tests' and 'make e2e-tests' to run tests.

Questions:
- Should we add a refresh token?
- We can seperate the 'User' from 'Profile', removing the awkwardness of Managers having 'age' field.
- We can make session start and end times enum instead of Datetime.
- We can move to test-containers instead of InMemoryDatabase for e2e tests for more real-world like testing. Test containers brought issues on my M1 machine.
