import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsNotEmpty } from 'class-validator';

export class DeleteMoviesRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsDefined()
  ids: string[];
}
