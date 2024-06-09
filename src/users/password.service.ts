import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  constructor() {}

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
