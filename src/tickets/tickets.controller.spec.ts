import { Movie, Ticket } from '@prisma/client';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { JwtRequest, UserwithoutPassword } from '../types/JwtRequest';

describe('TicketsController', () => {
  let controller: TicketsController;
  let service: TicketsService;
  const ticket: Ticket = {
    id: '1',
    sessionId: '1',
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    hasWatched: false,
  };
  const movie: Movie = {
    id: '1',
    name: 'test',
    ageRestriction: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const user: UserwithoutPassword = {
    id: '1',
    email: 'foo@foo.com',
    role: 'CUSTOMER',
    age: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const req = { user } as JwtRequest;

  beforeEach(() => {
    service = new TicketsService(null);
    controller = new TicketsController(service);
  });

  describe('create ticket', () => {
    it('should return the created ticket', async () => {
      jest
        .spyOn(service, 'createTicket')
        .mockImplementation(() => Promise.resolve(ticket));
      expect(
        await controller.createTicket(req, { sessionId: ticket.sessionId }),
      ).toBe(ticket);
    });
  });

  describe('watch ticket', () => {
    it('should return the ticket as watched', async () => {
      jest
        .spyOn(service, 'watchTicket')
        .mockImplementation(() =>
          Promise.resolve({ ...ticket, hasWatched: true }),
        );
      expect(await controller.watchTicket(req, ticket.id)).toStrictEqual({
        ...ticket,
        hasWatched: true,
      });
    });
  });

  describe('watch history', () => {
    it('should return movies of the watched tickets', async () => {
      jest
        .spyOn(service, 'getWatchedMovies')
        .mockImplementation(() => Promise.resolve([movie]));
      expect(await controller.getWatchHistory(req)).toStrictEqual([movie]);
    });
  });
});
