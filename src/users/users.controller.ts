import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtRequest, UserwithoutPassword } from '../types/JwtRequest';
import { UserRole } from '@prisma/client';
import { Roles } from '../guards/decorators';

@Controller('users')
@Roles(UserRole.CUSTOMER)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async me(@Request() req: JwtRequest): Promise<UserwithoutPassword> {
    const user = await this.usersService.findOneById(req.user.sub);
    delete user.hashedPassword;
    return user;
  }
}
