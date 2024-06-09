import { Module } from '@nestjs/common';
import { SessionsManagerController } from './sessions.manager.controller';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [],
  controllers: [SessionsController, SessionsManagerController],
  providers: [SessionsService],
})
export class SessionsModule {}
