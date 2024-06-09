import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersManagerController } from './users.manager.controller';
import { PasswordService } from './password.service';

@Module({
  imports: [],
  controllers: [UsersController, UsersManagerController],
  providers: [UsersService, PasswordService],
  exports: [UsersService, PasswordService],
})
export class UsersModule {}
