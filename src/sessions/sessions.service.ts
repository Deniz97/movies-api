import { Prisma, Session } from '@prisma/client';
import { PrismaService } from '../crud/prisma.service';
import { CreateSessionDto } from './dtos/CreateSessionDto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionsService {
  constructor(private readonly prismaService: PrismaService) {}

  createSession(createSessionDto: CreateSessionDto): Promise<Session> {
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
