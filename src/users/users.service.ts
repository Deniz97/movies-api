import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/crud/prisma.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { Prisma, UserRole } from '@prisma/client';
import { hashPassword } from 'src/utils/passw-hasher';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {
    setTimeout(async () => {
      const user = await this.prismaService.user.findUnique({
        where: { email: 'admin@admin.com' },
      });
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          role: UserRole.MANAGER,
        },
      });
      console.log('User updated to manager role');
    }, 1000);
  }

  async createUser(createUserDto: CreateUserDto) {
    const createData: Prisma.UserCreateInput = {
      email: createUserDto.email,
      hashedPassword: await hashPassword(createUserDto.password),
      age: createUserDto.age,
      role: UserRole.CUSTOMER,
    };
    return this.prismaService.user.create({
      data: createData,
    });
  }

  findOneByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
