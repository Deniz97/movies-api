import { Prisma, Session } from '@prisma/client';
import { PrismaService } from '../crud/prisma.service';
import { CreateSessionDto } from './dtos/CreateSessionDto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class SessionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSession(createSessionDto: CreateSessionDto): Promise<Session> {
    const alreadyBooked = await this.prismaService.session.findFirst({
      where: {
        OR: [
          {
            startAt: {
              gte: createSessionDto.startAt,
              lt: createSessionDto.endAt,
            },
          },
          {
            endAt: {
              gt: createSessionDto.startAt,
              lte: createSessionDto.endAt,
            },
          },
        ],
      },
    });
    if (alreadyBooked !== null) {
      throw new HttpException('Session already booked', HttpStatus.BAD_REQUEST);
    }
    const toCreate: Prisma.SessionCreateInput = {
      movie: {
        connect: {
          id: createSessionDto.movieId,
        },
      },
      startAt: createSessionDto.startAt,
      endAt: createSessionDto.endAt,
    };
    return this.prismaService.session.create({
      data: toCreate,
    });
  }

  getUnstartedSessions(): Promise<Session[]> {
    return this.prismaService.session.findMany({
      where: {
        startAt: {
          gte: new Date(),
        },
      },
    });
  }
}
