import { Controller, Request, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtRequest, UserwithoutPassword } from '../types/JwtRequest';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './dtos/CreateUserDto';
import { Roles } from '../guards/decorators';

@Controller('users-manager')
@Roles(UserRole.MANAGER)
export class UsersManagerController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Request() req: JwtRequest,
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserwithoutPassword> {
    const created = await this.usersService.createUser(
      createUserDto,
      UserRole.CUSTOMER,
    );
    delete created.hashedPassword;
    return created;
  }
}
