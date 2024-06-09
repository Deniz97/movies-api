import { User } from '@prisma/client';

import { UsersManagerController } from './users.manager.controller';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dtos/CreateUserRequest';

describe('UsersManagerController', () => {
  let usersManagerController: UsersManagerController;
  let usersService: UsersService;
  const user: User = {
    id: '1',
    email: 'foo@foo.com',
    age: 15,
    hashedPassword: 'hashedPassword',
    role: 'CUSTOMER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  beforeEach(() => {
    usersService = new UsersService(null, null);
    usersManagerController = new UsersManagerController(usersService);
  });

  describe('create', () => {
    it('should return the created movie', async () => {
      usersService.createUser = jest
        .fn()
        .mockImplementation(() => Promise.resolve(user));
      const createUserDto: CreateUserRequest = {
        email: 'foo@foo.com',
        age: 15,
        password: 'password',
      };
      expect(await usersManagerController.createUser(createUserDto)).toBe(user);
    });
  });
});
