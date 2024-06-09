import { Session } from '@prisma/client';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';

describe('MoviesController', () => {
  let sessionsController: SessionsController;
  let sessionsService: SessionsService;

  beforeEach(() => {
    sessionsService = new SessionsService(null);
    sessionsController = new SessionsController(sessionsService);
  });

  describe('get unstarted sessions', () => {
    it('should return an array of sessions', async () => {
      const result: Session[] = [
        {
          id: '1',
          movieId: '1',
          startAt: new Date(),
          endAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(sessionsService, 'getUnstartedSessions')
        .mockImplementation(() => Promise.resolve(result));

      expect(await sessionsController.getUnstartedSessions()).toBe(result);
    });
  });
});
