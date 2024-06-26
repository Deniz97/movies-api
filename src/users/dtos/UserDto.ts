import { UserRole } from '@prisma/client';
import { IsEmail } from 'class-validator';
import { IsDbId } from '../../guards/validation-decorators';

export class UserDto {
  @IsDbId()
  id: string;
  @IsEmail()
  email: string;
  role: UserRole;
}
