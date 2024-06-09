import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty()
  movieId: string;
  @ApiProperty()
  startAt: Date;
  @ApiProperty()
  endAt: Date;
}
