import { Injectable } from '@nestjs/common';
import { PrismaService } from '../crud/prisma.service';
import { CreateUserDto } from './dtos/CreateUserDto';
import { Prisma, User, UserRole } from '@prisma/client';
import { hashPassword } from '../utils/passw-hasher';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto, role: UserRole) {
    const createData: Prisma.UserCreateInput = {
      email: createUserDto.email,
      hashedPassword: await hashPassword(createUserDto.password),
      age: createUserDto.age,
      role: role,
    };
    return this.prismaService.user.create({
      data: createData,
    });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  findOneById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }
}
