import { Body, Controller, Get, Post } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dtos/CreateMovieDto';
import { UserRole } from '@prisma/client';
import { Roles } from '../guards/decorators';

@Controller('movies-manager')
@Roles(UserRole.MANAGER)
export class MoviesManagerController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies() {
    return this.moviesService.findAll();
  }

  @Post()
  createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }
}
