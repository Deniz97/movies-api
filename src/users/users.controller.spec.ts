import { User } from '@prisma/client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtRequest, JwtUser } from 'src/types/JwtRequest';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const jwtUser: JwtUser = {
    sub: '1',
    email: 'foo@foo.com',
    role: 'CUSTOMER',
    iat: 1,
    exp: 1,
  };
  const user: User = {
    id: '1',
    email: 'foo@foo.com',
    age: 15,
    hashedPassword: 'hashedPassword',
    role: 'CUSTOMER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const req = { user: jwtUser } as JwtRequest;

  beforeEach(() => {
    usersService = {
      findOneById: jest.fn().mockResolvedValue(user),
      // Add any other methods that you might need to mock
    } as unknown as UsersService;

    usersController = new UsersController(usersService);
  });

  describe('get me', () => {
    it('should return the authenticated user', async () => {
      usersService.findOneById = jest.fn().mockResolvedValue(user);
      expect(await usersController.me(req)).toStrictEqual({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      expect(usersService.findOneById).toHaveBeenCalledWith(jwtUser.sub);
    });
  });
});
