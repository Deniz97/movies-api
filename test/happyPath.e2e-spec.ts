import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { addHours, startOfHour } from 'date-fns';
import { CreateMovieDto } from 'src/movies/dtos/CreateMovieDto';
import {
  constructAppAndCreateUsers,
  spinDownMongo,
  spinUpMongo,
} from './utils';

describe('Happy Path (e2e)', () => {
  let app: INestApplication;

  let mongod;
  let adminToken;
  let customerToken;
  const createMovieDto: CreateMovieDto = {
    name: 'Movie 1',
    ageRestriction: 10,
  };
  let customerId;
  let movieId;
  let sessionId;
  let ticketId;

  beforeAll(async () => {
    mongod = await spinUpMongo();
    const res = await constructAppAndCreateUsers();
    app = res.app;
    customerId = res.customerId;
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
        sessionId = res.body.id;
      });
  });

  it('login customer', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'customer@customer.com',
        password: 'customer',
      })
      .expect(200)
      .expect((res) => {
        customerToken = `${res.body.accessToken}`;
      });
  });

  it('customer views sessions', async () => {
    const nextHourStart = addHours(startOfHour(new Date()), 1);
    const nextHourEnd = addHours(nextHourStart, 1);
    return request(app.getHttpServer())
      .get('/sessions')
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body[0].startAt).toBe(nextHourStart.toISOString());
        expect(res.body[0].endAt).toBe(nextHourEnd.toISOString());
        expect(res.body[0].movieId).toBe(movieId);
        sessionId = res.body[0].id;
      });
  });

  it('customer buys ticket', async () => {
    return request(app.getHttpServer())
      .post('/tickets')
      .auth(customerToken, { type: 'bearer' })
      .send({
        sessionId: sessionId,
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.sessionId).toBe(sessionId);
        expect(res.body.userId).toBe(customerId);
        expect(res.body.hasWatched).toBe(false);
        ticketId = res.body.id;
      });
  });

  it('customer watches ticket', async () => {
    return request(app.getHttpServer())
      .patch(`/tickets/${ticketId}/watch`)
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body.sessionId).toBe(sessionId);
        expect(res.body.userId).toBe(customerId);
        expect(res.body.hasWatched).toBe(true);
        ticketId = res.body.id;
      });
  });

  it('customer viewes watch history', async () => {
    return request(app.getHttpServer())
      .get(`/tickets/watch-history`)
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body[0].name).toBe(createMovieDto.name);
        expect(res.body[0].ageRestriction).toBe(createMovieDto.ageRestriction);
      });
  });
});
