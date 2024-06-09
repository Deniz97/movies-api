import { Movie, Prisma, Ticket } from '@prisma/client';
import { CreateTicketDto } from './dtos/CreateTicketDto';
import { PrismaService } from '../crud/prisma.service';
import { uniqBy } from 'lodash';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketsService {
  constructor(private readonly prismaService: PrismaService) {}

  createTicket(
    createTicketDto: CreateTicketDto,
    userId: string,
  ): Promise<Ticket> {
    const toCreate: Prisma.TicketCreateInput = {
      session: {
        connect: {
          id: createTicketDto.sessionId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      hasWatched: false,
    };
    return this.prismaService.ticket.create({
      data: toCreate,
    });
  }

  async watchTicket(ticketId: string, userId: string): Promise<Ticket> {
    return this.prismaService.ticket.update({
      where: {
        id: ticketId,
        userId: userId,
      },
      data: {
        hasWatched: true,
      },
    });
  }

  async getWatchedMovies(userId: string): Promise<Movie[]> {
    // return list of movies the user has watched
    const movies = await this.prismaService.ticket.findMany({
      where: {
        userId: userId,
        hasWatched: true,
      },
      include: {
        session: {
          include: {
            movie: true,
          },
        },
      },
    });

    return uniqBy(
      movies.map((ticket) => ticket.session.movie),
      'id',
    );
  }
}
