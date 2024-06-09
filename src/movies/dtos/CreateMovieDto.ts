import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  ageRestriction: number;
}
