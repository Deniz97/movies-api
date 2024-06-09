import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server';
import { PrismaService } from '../src/crud/prisma.service';
import { UsersService } from '../src/users/users.service';
import { Movie, UserRole } from '@prisma/client';
import { addHours, startOfHour } from 'date-fns';
import { CreateMovieDto } from 'src/movies/dtos/CreateMovieDto';

jest.setTimeout(60000);
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let mongod;
  let adminToken;
  let customerToken;
  let createMovieDto: CreateMovieDto;
  let customerId;
  let movieId;
  let sessionId;
  let ticketId;

  beforeAll(async () => {
    // mongod = await MongoMemoryServer.create();
    mongod = await MongoMemoryReplSet.create({
      replSet: { count: 1, dbName: 'test', storageEngine: 'wiredTiger' },
    });

    const uri = mongod.getUri();
    const connectionString =
      uri.split('?')[0] +
      'test?' +
      uri.split('?')[1] +
      '&retryWrites=true&w=majority';
    process.env.DATABASE_URL = connectionString;
  });

  afterAll(async () => {
    await mongod.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get<UsersService>(UsersService);
    if (!(await usersService.findOneByEmail('customer@customer.com'))) {
      const customer = await usersService.createUser(
        {
          email: 'customer@customer.com',
          password: 'customer',
          age: 20,
        },
        UserRole.CUSTOMER,
      );
      customerId = customer.id;
    }
    if (!(await usersService.findOneByEmail('admin@admin.com'))) {
      await usersService.createUser(
        {
          email: 'admin@admin.com',
          password: 'admin',
          age: 20,
        },
        UserRole.MANAGER,
      );
    }
    createMovieDto = {
      name: 'Movie 1',
      ageRestriction: 10,
    };
    await app.init();
  });

  afterEach(async () => {
    await app.close();
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

  it('admin posts sessions', async () => {
    const prismaService = app.get(PrismaService);
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
