import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateUserRequest {
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  password: string;
  @ApiProperty()
  @IsPositive()
  age: number;
}
