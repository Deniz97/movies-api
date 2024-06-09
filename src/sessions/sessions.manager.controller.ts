import { Body, Controller, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { Roles } from '../guards/decorators';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dtos/CreateSessionDto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('sessions-manager')
@Roles(UserRole.MANAGER)
@ApiBearerAuth('ApiKeyAuth')
export class SessionsManagerController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  createSession(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionsService.createSession(createSessionDto);
  }
}
