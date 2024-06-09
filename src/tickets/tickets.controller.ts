import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { Movie, Ticket, UserRole } from '@prisma/client';
import { Roles } from '../guards/decorators';
import { CreateTicketDto } from './dtos/CreateTicketDto';
import { JwtRequest } from '../types/JwtRequest';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@Roles(UserRole.CUSTOMER)
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Post()
  createTicket(
    @Request() req: JwtRequest,
    @Body() createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    return this.ticketService.createTicket(createTicketDto, req.user.sub);
  }

  @Patch(':id/watch')
  watchTicket(
    @Request() req: JwtRequest,
    @Param('id') ticketId: string,
  ): Promise<Ticket> {
    return this.ticketService.watchTicket(ticketId, req.user.sub);
  }

  @Get('/watch-history')
  async getWatchHistory(@Request() req: JwtRequest): Promise<Movie[]> {
    // return list of movies the user has watched
    return this.ticketService.getWatchedMovies(req.user.sub);
  }
}
