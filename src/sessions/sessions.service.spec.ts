import { Session } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../crud/prisma.service';
import { SessionsService } from './sessions.service';
import { addHours, startOfHour } from 'date-fns';
import { CrudModule } from '../crud/crud.module';

describe('SessionsService', () => {
  let prismasService: PrismaService;
  let sessionsService: SessionsService;
  let sessionFuture: Session;
  let sessionPast: Session;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: PrismaService,
          useValue: {
            session: {
              findMany: jest.fn(() => [sessionFuture]),
              create: jest.fn(() => sessionFuture),
            },
          },
        },
      ],
    }).compile();

    prismasService = module.get<PrismaService>(PrismaService);
    sessionsService = module.get<SessionsService>(SessionsService);
    sessionFuture = {
      startAt: addHours(startOfHour(new Date()), 1),
      endAt: addHours(startOfHour(new Date()), 2),
      id: '1',
      movieId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    sessionPast = {
      startAt: addHours(startOfHour(new Date()), -2),
      endAt: addHours(startOfHour(new Date()), -1),
      id: '2',
      movieId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('#findAll', () => {
    it('return only the unstarted sessions', async () => {
      expect(await sessionsService.getUnstartedSessions()).toEqual([
        sessionFuture,
      ]);
      expect(prismasService.session.findMany).toHaveBeenCalled();
    });
  });

  describe('#create', () => {
    it('returns the creted session', async () => {
      expect(await sessionsService.createSession(sessionFuture)).toEqual(
        sessionFuture,
      );
      expect(prismasService.session.create).toHaveBeenCalled();
    });
  });
});
