import { Test } from '@nestjs/testing';
import { PasswordService } from './password.service';
import { random } from 'lodash';

describe('PasswordService', () => {
  let passwordService: PasswordService;
  const password = random(1000).toString();
  let hashPassword;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    passwordService = module.get<PasswordService>(PasswordService);
  });

  describe('password operations', () => {
    it('hash', async () => {
      const hashed = await passwordService.hashPassword(password);
      expect(hashed).toBeTruthy();
      hashPassword = hashed;
    });
    it('compare', async () => {
      expect(
        await passwordService.comparePasswords(password, hashPassword),
      ).toBeTruthy();
    });
  });
});
