import { Injectable } from '@nestjs/common';
import { PrismaService } from '../crud/prisma.service';

@Injectable()
export class PasswordService {
  constructor(private prismaService: PrismaService) {}

  async hashPassword(password: string): Promise<string> {
    /* eslint-disable @typescript-eslint/no-var-requires */
    const bcrypt = require('bcrypt');
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    /* eslint-disable @typescript-eslint/no-var-requires */
    const bcrypt = require('bcrypt');
    return bcrypt.compareSync(password, hashedPassword);
  }
}
