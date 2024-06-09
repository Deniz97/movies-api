import { Controller, Get } from '@nestjs/common';
import { Session, UserRole } from '@prisma/client';
import { Roles } from '../guards/decorators';
import { SessionsService } from './sessions.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('sessions')
@Roles(UserRole.CUSTOMER)
@ApiBearerAuth('ApiKeyAuth')
export class SessionsController {
  constructor(private readonly sessionService: SessionsService) {}

  @Get()
  getUnstartedSessions(): Promise<Session[]> {
    return this.sessionService.getUnstartedSessions();
  }
}
