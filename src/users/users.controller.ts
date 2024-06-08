import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtRequest, UserwithoutPassword } from 'src/types/JwtRequest';
import { UserRole } from '@prisma/client';
import { Roles } from '../guards/decorators';

@Controller('users')
@Roles(UserRole.CUSTOMER)
export class UsersController {
  constructor(private readonly appService: UsersService) {}

  @Get()
  me(@Request() req: JwtRequest): UserwithoutPassword {
    return req.user;
  }
}
