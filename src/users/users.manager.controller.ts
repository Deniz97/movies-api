import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserwithoutPassword } from '../types/JwtRequest';
import { UserRole } from '@prisma/client';
import { CreateUserRequest } from './dtos/CreateUserRequest';
import { Roles } from '../guards/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users-manager')
@Roles(UserRole.MANAGER)
@ApiTags('users-manager')
@ApiBearerAuth('ApiKeyAuth')
export class UsersManagerController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserRequest,
  ): Promise<UserwithoutPassword> {
    const created = await this.usersService.createUser(
      createUserDto,
      UserRole.CUSTOMER,
    );
    delete created.hashedPassword;
    return created;
  }
}
