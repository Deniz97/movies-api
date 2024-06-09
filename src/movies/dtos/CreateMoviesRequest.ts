import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';
import { CreateMovieDto } from './CreateMovieDto';

export class CreateMoviesRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  movies: CreateMovieDto[];
}
