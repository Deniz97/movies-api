import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateMovieDto } from 'src/movies/dtos/CreateMovieDto';
import {
  spinUpMongo,
  constructAppAndCreateUsers,
  spinDownMongo,
} from './utils';

describe('Filter Movies (e2e)', () => {
  let app: INestApplication;
  let mongod;
  let adminToken;
  let customerToken;

  const movie1: CreateMovieDto = {
    name: 'a Movie 1',
    ageRestriction: 14,
  };
  const movie2: CreateMovieDto = {
    name: 'b Movie 2',
    ageRestriction: 10,
  };

  const movie3: CreateMovieDto = {
    name: 'c Movie-3-foo',
    ageRestriction: 7,
  };
  const movie4: CreateMovieDto = {
    name: 'd Movie-4-foo',
    ageRestriction: 5,
  };

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

  it('admin posts movie1', () => {
    return request(app.getHttpServer())
      .post('/movies-manager')
      .auth(adminToken, { type: 'bearer' })
      .send(movie1)
      .expect(201);
  });

  it('admin posts movie2', () => {
    return request(app.getHttpServer())
      .post('/movies-manager')
      .auth(adminToken, { type: 'bearer' })
      .send(movie2)
      .expect(201);
  });

  it('admin posts movie3', () => {
    return request(app.getHttpServer())
      .post('/movies-manager')
      .auth(adminToken, { type: 'bearer' })
      .send(movie3)
      .expect(201);
  });

  it('admin posts movie4', () => {
    return request(app.getHttpServer())
      .post('/movies-manager')
      .auth(adminToken, { type: 'bearer' })
      .send(movie4)
      .expect(201);
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

  it('customer views movies', async () => {
    return request(app.getHttpServer())
      .get('/movies')
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body.find((m) => m.name === movie1.name).name).toBe(
          movie1.name,
        );
        expect(res.body.find((m) => m.name === movie2.name).name).toBe(
          movie2.name,
        );
        expect(res.body.find((m) => m.name === movie3.name).name).toBe(
          movie3.name,
        );
        expect(res.body.find((m) => m.name === movie4.name).name).toBe(
          movie4.name,
        );
      });
  });

  it('customer views movies filter title', async () => {
    return request(app.getHttpServer())
      .get('/movies?filterField=name&filterKey=e 1')
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body[0].name).toBe(movie1.name);
      });
  });

  it('customer views movies order title asc', async () => {
    return request(app.getHttpServer())
      .get('/movies?sortField=name&sortOrder=asc')
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body[0].name).toBe(movie1.name);
        expect(res.body[1].name).toBe(movie2.name);
        expect(res.body[2].name).toBe(movie3.name);
        expect(res.body[3].name).toBe(movie4.name);
      });
  });

  it('customer views movies order title desc', async () => {
    return request(app.getHttpServer())
      .get('/movies?sortField=name&sortOrder=desc')
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body[0].name).toBe(movie4.name);
        expect(res.body[1].name).toBe(movie3.name);
        expect(res.body[2].name).toBe(movie2.name);
        expect(res.body[3].name).toBe(movie1.name);
      });
  });

  it('customer views movies order age restriction asc', async () => {
    return request(app.getHttpServer())
      .get('/movies?sortField=name&sortOrder=asc')
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body[0].name).toBe(movie1.name);
        expect(res.body[1].name).toBe(movie2.name);
        expect(res.body[2].name).toBe(movie3.name);
        expect(res.body[3].name).toBe(movie4.name);
      });
  });

  it('customer views movies order age restriction desc', async () => {
    return request(app.getHttpServer())
      .get('/movies?sortField=name&sortOrder=desc')
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body[0].name).toBe(movie4.name);
        expect(res.body[1].name).toBe(movie3.name);
        expect(res.body[2].name).toBe(movie2.name);
        expect(res.body[3].name).toBe(movie1.name);
      });
  });

  it('customer views movies filter title order age', async () => {
    return request(app.getHttpServer())
      .get(
        '/movies?filterField=name&filterKey=foo&sortField=ageRestriction&sortOrder=asc',
      )
      .auth(customerToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body[0].name).toBe(movie4.name);
        expect(res.body[1].name).toBe(movie3.name);
      });
  });
});
