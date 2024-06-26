import { Session } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../crud/prisma.service';
import { SessionsService } from './sessions.service';
import { addHours, startOfHour } from 'date-fns';
import { HttpException } from '@nestjs/common';

describe('SessionsService', () => {
  let prismasService: PrismaService;
  let sessionsService: SessionsService;
  const sessionFuture: Session = {
    startAt: addHours(startOfHour(new Date()), 1),
    endAt: addHours(startOfHour(new Date()), 2),
    id: '1',
    movieId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
              findFirst: jest.fn(() => sessionFuture),
            },
          },
        },
      ],
    }).compile();

    prismasService = module.get<PrismaService>(PrismaService);

    sessionsService = module.get<SessionsService>(SessionsService);
  });

  describe('get Sessions', () => {
    it('return only the unstarted sessions', async () => {
      expect(await sessionsService.getUnstartedSessions()).toEqual([
        sessionFuture,
      ]);
      expect(prismasService.session.findMany).toHaveBeenCalled();
    });
  });

  describe('create sessions', () => {
    it('returns the creted session', async () => {
      prismasService.session.findFirst = jest.fn().mockResolvedValue(null);
      expect(await sessionsService.createSession(sessionFuture)).toEqual(
        sessionFuture,
      );
      expect(prismasService.session.findFirst).toHaveBeenCalled();
      expect(prismasService.session.create).toHaveBeenCalled();
    });

    it('fails if already booked', async () => {
      prismasService.session.findFirst = jest
        .fn()
        .mockResolvedValue(sessionFuture);
      await expect(() =>
        sessionsService.createSession(sessionFuture),
      ).rejects.toThrow(HttpException);
      expect(prismasService.session.findFirst).toHaveBeenCalled();
      expect(prismasService.session.create).not.toHaveBeenCalled();
    });
  });
});
