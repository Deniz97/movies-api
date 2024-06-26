import { User } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { PasswordService } from '../users/password.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let passwordService: PasswordService;
  const user: User = {
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
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByEmail: jest.fn(() => user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(() => 'accessToken'),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(() => 'hashedPassword'),
            comparePasswords: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  describe('login', () => {
    it('happy path', async () => {
      usersService.findOneByEmail = jest.fn().mockReturnValue(user);
      passwordService.comparePasswords = jest.fn().mockReturnValue(true);
      jwtService.signAsync = jest.fn().mockReturnValue('accessToken');

      expect(await authService.login(user.email, 'password')).toEqual({
        accessToken: 'accessToken',
      });

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(user.email);
      expect(passwordService.comparePasswords).toHaveBeenCalledWith(
        'password',
        user.hashedPassword,
      );
      expect(jwtService.signAsync).toHaveBeenCalled();
    });

    it('wrong email', async () => {
      usersService.findOneByEmail = jest.fn().mockReturnValue(null);
      passwordService.comparePasswords = jest.fn().mockReturnValue(true);
      jwtService.signAsync = jest.fn().mockReturnValue('accessToken');

      await expect(() =>
        authService.login(user.email, 'password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(user.email);
      expect(passwordService.comparePasswords).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('wrong password', async () => {
      jwtService.signAsync = jest.fn().mockReturnValue('accessToken');
      usersService.findOneByEmail = jest.fn().mockReturnValue(user);
      passwordService.comparePasswords = jest.fn().mockReturnValue(false);

      await expect(() =>
        authService.login(user.email, 'password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(user.email);
      expect(passwordService.comparePasswords).toHaveBeenCalledWith(
        'password',
        user.hashedPassword,
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
