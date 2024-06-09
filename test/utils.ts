import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@prisma/client';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

export const spinUpMongo = async (): Promise<MongoMemoryReplSet> => {
  // mongod = await MongoMemoryServer.create();
  const mongod = await MongoMemoryReplSet.create({
    replSet: { count: 1, dbName: 'test', storageEngine: 'wiredTiger' },
  });

  const uri = mongod.getUri();
  const connectionString =
    uri.split('?')[0] +
    'test?' +
    uri.split('?')[1] +
    '&retryWrites=true&w=majority';
  process.env.DATABASE_URL = connectionString;
  return mongod;
};

export const spinDownMongo = async (mongod: MongoMemoryReplSet) => {
  await mongod.stop();
};

export const constructAppAndCreateUsers = async (): Promise<{
  app: INestApplication;
  customerId: string;
}> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app = moduleFixture.createNestApplication();
  const usersService = moduleFixture.get<UsersService>(UsersService);

  const customer = await usersService.createUser(
    {
      email: 'customer@customer.com',
      password: 'customer',
      age: 20,
    },
    UserRole.CUSTOMER,
  );
  const customerId = customer.id;

  await usersService.createUser(
    {
      email: 'admin@admin.com',
      password: 'admin',
      age: 20,
    },
    UserRole.MANAGER,
  );
  await app.init();
  return { customerId, app };
};
