import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService(null, null, null);
    authController = new AuthController(authService);
  });

  describe('login', () => {
    it('should login succesfully', async () => {
      authService.login = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ accessToken: 'token' }));

      expect(
        await authController.login({
          email: 'foo@foo.com',
          password: 'password',
        }),
      ).toStrictEqual({ accessToken: 'token' });
      expect(authService.login).toHaveBeenCalledWith('foo@foo.com', 'password');
    });
  });
});
