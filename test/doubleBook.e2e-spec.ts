import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { addHours, startOfHour } from 'date-fns';
import { CreateMovieDto } from 'src/movies/dtos/CreateMovieDto';
import {
  spinUpMongo,
  constructAppAndCreateUsers,
  spinDownMongo,
} from './utils';

jest.setTimeout(60000);
describe('Double Book (e2e)', () => {
  let app: INestApplication;
  let mongod;
  let adminToken;
  const createMovieDto: CreateMovieDto = {
    name: 'a Movie 1',
    ageRestriction: 14,
  };
  let movieId;

  beforeAll(async () => {
    mongod = await spinUpMongo();
    const res = await constructAppAndCreateUsers();
    app = res.app;
  });

  afterAll(async () => {
    await app.close();
    await spinDownMongo(mongod);
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('login admin', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@admin.com',
        password: 'admin',
      })
      .expect(200)
      .expect((res) => {
        adminToken = `${res.body.accessToken}`;
      });
  });

  it('admin posts movie', () => {
    return request(app.getHttpServer())
      .post('/movies-manager')
      .auth(adminToken, { type: 'bearer' })
      .send(createMovieDto)
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toBe(createMovieDto.name);
        expect(res.body.ageRestriction).toBe(createMovieDto.ageRestriction);
        movieId = res.body.id;
      });
  });

  it('admin posts session', async () => {
    const nextHourStart = addHours(startOfHour(new Date()), 1);
    const nextHourEnd = addHours(nextHourStart, 1);
    return request(app.getHttpServer())
      .post('/sessions-manager')
      .auth(adminToken, { type: 'bearer' })
      .send({
        startAt: nextHourStart,
        endAt: nextHourEnd,
        movieId: movieId,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.startAt).toBe(nextHourStart.toISOString());
        expect(res.body.endAt).toBe(nextHourEnd.toISOString());
        expect(res.body.movieId).toBe(movieId);
      });
  });

  it('admin posts session over booked', async () => {
    const nextHourStart = addHours(startOfHour(new Date()), 1.5);
    const nextHourEnd = addHours(nextHourStart, 1.5);
    return request(app.getHttpServer())
      .post('/sessions-manager')
      .auth(adminToken, { type: 'bearer' })
      .send({
        startAt: nextHourStart,
        endAt: nextHourEnd,
        movieId: movieId,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Session already booked');
      });
  });

  it('admin posts session new', async () => {
    const nextHourStart = addHours(startOfHour(new Date()), 2);
    const nextHourEnd = addHours(nextHourStart, 1);
    return request(app.getHttpServer())
      .post('/sessions-manager')
      .auth(adminToken, { type: 'bearer' })
      .send({
        startAt: nextHourStart,
        endAt: nextHourEnd,
        movieId: movieId,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.startAt).toBe(nextHourStart.toISOString());
        expect(res.body.endAt).toBe(nextHourEnd.toISOString());
        expect(res.body.movieId).toBe(movieId);
      });
  });
});
