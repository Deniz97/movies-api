import { Session } from '@prisma/client';
import { SessionsManagerController } from './sessions.manager.controller';
import { SessionsService } from './sessions.service';

describe('SessionsManagerController', () => {
  let sessionsManagerController: SessionsManagerController;
  let sessionsService: SessionsService;

  beforeEach(() => {
    sessionsService = new SessionsService(null);
    sessionsManagerController = new SessionsManagerController(sessionsService);
  });

  describe('create', () => {
    it('should return the created movie', async () => {
      const session: Session = {
        id: '1',
        movieId: '1',
        startAt: new Date(),
        endAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest
        .spyOn(sessionsService, 'createSession')
        .mockImplementation(() => Promise.resolve(session));
      expect(await sessionsManagerController.createSession(session)).toBe(
        session,
      );
    });
  });
});
