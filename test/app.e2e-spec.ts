import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongoContainer: StartedMongoDBContainer;
  let prisma;

  beforeAll(async () => {
    mongoContainer = await new MongoDBContainer().start();
    const logs = await mongoContainer.logs();
    console.log('MongoDB logs:', logs);
    const connectionString =
      mongoContainer.getConnectionString() + '/?retryWrites=true&w=majority';
    process.env.DATABASE_URL = connectionString;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await mongoContainer.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
