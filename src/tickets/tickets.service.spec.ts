import { Movie, Ticket } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../crud/prisma.service';
import { TicketsService } from './tickets.service';

describe('TicketsService', () => {
  let prismasService: PrismaService;
  let ticketsService: TicketsService;
  const ticket: Ticket = {
    id: '1',
    sessionId: '1',
    userId: '1',
    hasWatched: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const movie: Movie = {
    id: '1',
    name: 'test',
    ageRestriction: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TicketsService,
        {
          provide: PrismaService,
          useValue: {
            ticket: {
              findMany: jest.fn(() => [{ ...ticket, session: { movie } }]),
              create: jest.fn(() => ticket),
              update: jest.fn(() => ({ ...ticket, hasWatched: true })),
            },
          },
        },
      ],
    }).compile();

    prismasService = module.get<PrismaService>(PrismaService);
    ticketsService = module.get<TicketsService>(TicketsService);
  });

  describe('#create ticket', () => {
    it('returns the creted session', async () => {
      expect(await ticketsService.createTicket(ticket, ticket.userId)).toEqual(
        ticket,
      );
      expect(prismasService.ticket.create).toHaveBeenCalled();
    });
  });

  describe('watch ticket', () => {
    it('return only the unstarted sessions', async () => {
      expect(
        await ticketsService.watchTicket(ticket.id, ticket.userId),
      ).toEqual({
        ...ticket,
        hasWatched: true,
      });
      expect(prismasService.ticket.update).toHaveBeenCalled();
    });
  });

  describe('get watch history', () => {
    it('return the watched movies', async () => {
      expect(await ticketsService.getWatchedMovies(ticket.userId)).toEqual([
        movie,
      ]);
      expect(prismasService.ticket.findMany).toHaveBeenCalled();
    });
  });
});
