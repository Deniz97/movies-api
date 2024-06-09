import { User, UserRole } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../crud/prisma.service';
import { UsersService } from './users.service';
import { CreateUserRequest } from './dtos/CreateUserRequest';
import { PasswordService } from './password.service';

describe('UsersService', () => {
  let prismasService: PrismaService;
  let usersService: UsersService;
  let user: User = {
    id: '1',
    email: 'foo@foo.com',
    age: 15,
    hashedPassword: 'hashedPassword',
    role: 'CUSTOMER',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        PasswordService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(() => user),
              findUnique: jest.fn(() => user),
            },
          },
        },
      ],
    }).compile();

    prismasService = module.get<PrismaService>(PrismaService);

    usersService = module.get<UsersService>(UsersService);
  });

  describe('get users', () => {
    it('by email', async () => {
      expect(await usersService.findOneByEmail(user.email)).toEqual(user);
      expect(prismasService.user.findUnique).toHaveBeenCalled();
    });
    it('by id', async () => {
      expect(await usersService.findOneByEmail(user.id)).toEqual(user);
      expect(prismasService.user.findUnique).toHaveBeenCalled();
    });
  });

  describe('create user', () => {
    it('returns the creted user as customer', async () => {
      const userCreateDto: CreateUserRequest = {
        email: user.email,
        password: 'password',
        age: user.age,
      };
      expect(
        await usersService.createUser(userCreateDto, UserRole.CUSTOMER),
      ).toStrictEqual({ ...user, role: UserRole.CUSTOMER });
      expect(prismasService.user.create).toHaveBeenCalled();
    });

    describe('create user', () => {
      it('returns the creted as manager', async () => {
        const userCreateDto: CreateUserRequest = {
          email: user.email,
          password: 'password',
          age: user.age,
        };
        prismasService.user.create = jest
          .fn()
          .mockResolvedValue({ ...user, role: UserRole.MANAGER });
        expect(
          await usersService.createUser(userCreateDto, UserRole.MANAGER),
        ).toStrictEqual({ ...user, role: UserRole.MANAGER });
        expect(prismasService.user.create).toHaveBeenCalled();
      });
    });
  });
});
