import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { IsDbId } from '../../guards/decorators';

export class CreateSessionDto {
  @ApiProperty()
  @IsDbId()
  movieId: string;

  @ApiProperty()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsDateString()
  endAt: Date;
}
