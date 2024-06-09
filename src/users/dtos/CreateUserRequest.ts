import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  age: number;
}
