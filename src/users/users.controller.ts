import { Controller, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtRequest } from '../types/JwtRequest';
import { UserRole } from '@prisma/client';
import { Roles } from '../guards/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dtos/UserDto';

@Controller('users')
@Roles(UserRole.CUSTOMER)
@ApiTags('users')
@ApiBearerAuth('ApiKeyAuth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async me(@Request() req: JwtRequest): Promise<UserDto> {
    const user = await this.usersService.findOneById(req.user.sub);
    delete user.hashedPassword;
    return { id: user.id, email: user.email, role: user.role };
  }
}
