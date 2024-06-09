import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDefined, IsNotEmpty } from 'class-validator';
import { CreateMovieDto } from './CreateMovieDto';
import { each } from 'lodash';

export class CreateMoviesRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  movies: CreateMovieDto[];
}
