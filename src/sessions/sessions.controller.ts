import { Controller, Get } from '@nestjs/common';
import { Session, UserRole } from '@prisma/client';
import { Roles } from '../guards/auth-decorators';
import { SessionsService } from './sessions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('sessions')
@Roles(UserRole.CUSTOMER)
@ApiTags('sessions')
@ApiBearerAuth('ApiKeyAuth')
export class SessionsController {
  constructor(private readonly sessionService: SessionsService) {}

  @Get()
  getUnstartedSessions(): Promise<Session[]> {
    return this.sessionService.getUnstartedSessions();
  }
}
