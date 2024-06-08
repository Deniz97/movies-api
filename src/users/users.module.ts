import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersManagerController } from './users.manager.controller';

@Module({
  imports: [],
  controllers: [UsersController, UsersManagerController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
