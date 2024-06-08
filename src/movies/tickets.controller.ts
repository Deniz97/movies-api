import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { Movie, Prisma, UserRole } from '@prisma/client';
import { Roles } from '../guards/decorators';
import { CreateTicketDto } from './dtos/CreateTicketDto';
import { PrismaService } from 'src/crud/prisma.service';
import { JwtRequest } from 'src/types/JwtRequest';
import { uniqBy } from 'lodash';

@Controller('tickets')
@Roles(UserRole.CUSTOMER)
export class TicketsController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  createTicket(
    @Request() req: JwtRequest,
    @Body() createTicketDto: CreateTicketDto,
  ) {
    const toCreate: Prisma.TicketCreateInput = {
      session: {
        connect: {
          id: createTicketDto.sessionId,
        },
      },
      user: {
        connect: {
          id: req.user.id,
        },
      },
      hasWatched: false,
    };
    return this.prismaService.ticket.create({
      data: toCreate,
    });
  }

  @Post(':id/watch')
  watchTicket(@Request() req: JwtRequest, @Param('id') ticketId: string) {
    return this.prismaService.ticket.update({
      where: {
        id: ticketId,
        userId: req.user.id,
      },
      data: {
        hasWatched: true,
      },
    });
  }

  @Get('/watch-history')
  async getWatchHistory(@Request() req: JwtRequest): Promise<Movie[]> {
    // return list of movies the user has watched
    const movies = await this.prismaService.ticket.findMany({
      where: {
        userId: req.user.id,
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
