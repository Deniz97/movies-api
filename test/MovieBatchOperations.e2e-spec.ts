import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateMovieDto } from 'src/movies/dtos/CreateMovieDto';
import {
  constructAppAndCreateUsers,
  spinDownMongo,
  spinUpMongo,
} from './utils';

describe('Movie Batch Operations (e2e)', () => {
  let app: INestApplication;

  let mongod;
  let adminToken;
  const createMovieDto: CreateMovieDto = {
    name: 'Movie 1',
    ageRestriction: 10,
  };
  const createMovieDto2: CreateMovieDto = {
    name: 'Movie 2',
    ageRestriction: 10,
  };
  const createMovieDto3: CreateMovieDto = {
    name: 'Movie 3',
    ageRestriction: 10,
  };
  let movieId1;
  let movieId2;
  let movieId3;

  beforeAll(async () => {
    mongod = await spinUpMongo();
    const res = await constructAppAndCreateUsers();
    app = res.app;
  });

  afterAll(async () => {
    await app.close();
    await spinDownMongo(mongod);
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

  it('admin posts movie batch', () => {
    return request(app.getHttpServer())
      .post('/movies-manager/batch')
      .auth(adminToken, { type: 'bearer' })
      .send({ movies: [createMovieDto, createMovieDto2, createMovieDto3] })
      .expect(201)
      .expect((res) => {
        expect(res.body.count).toBe(3);
      });
  });

  it('admin gets newly create movies', () => {
    return request(app.getHttpServer())
      .get('/movies-manager')
      .auth(adminToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        const movieResponse = res.body.find(
          (movie) => movie.name === createMovieDto.name,
        );
        const movieResponse2 = res.body.find(
          (movie) => movie.name === createMovieDto2.name,
        );
        const movieResponse3 = res.body.find(
          (movie) => movie.name === createMovieDto3.name,
        );
        expect(movieResponse.name).toBe(createMovieDto.name);
        expect(movieResponse.ageRestriction).toBe(
          createMovieDto.ageRestriction,
        );
        movieId1 = movieResponse.id;
        expect(movieResponse2.name).toBe(createMovieDto2.name);
        expect(movieResponse2.ageRestriction).toBe(
          createMovieDto2.ageRestriction,
        );
        movieId2 = movieResponse2.id;
        expect(movieResponse3.name).toBe(createMovieDto3.name);
        expect(movieResponse3.ageRestriction).toBe(
          createMovieDto3.ageRestriction,
        );
        movieId3 = movieResponse3.id;
      });
  });

  it('admin delete movie batch', () => {
    return request(app.getHttpServer())
      .delete('/movies-manager/batch')
      .auth(adminToken, { type: 'bearer' })
      .send({ ids: [movieId1, movieId3] })
      .expect(200)
      .expect((res) => {
        expect(res.body.count).toBe(2);
      });
  });

  it('admin gets remaining movies', () => {
    return request(app.getHttpServer())
      .get('/movies-manager')
      .auth(adminToken, { type: 'bearer' })
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(1);
        expect(res.body[0].id).toBe(movieId2);
        expect(res.body[0].name).toBe(createMovieDto2.name);
        expect(res.body[0].ageRestriction).toBe(createMovieDto2.ageRestriction);
      });
  });
});
