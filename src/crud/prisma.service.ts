import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export type PrismaLogFormat = 'pretty' | 'colorless' | 'minimal';

const PRISMA_LOG_FORMAT: PrismaLogFormat =
  (process.env.PRISMA_LOG_FORMAT as PrismaLogFormat) || 'minimal';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      log: [
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: PRISMA_LOG_FORMAT,
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
