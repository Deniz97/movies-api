import { Body, Controller, Get, Post } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { CreateMovieDto } from '../dtos/CreateMovieDto';
import { UserRole } from '@prisma/client';
import { Roles } from '../../guards/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('movies-manager')
@Roles(UserRole.MANAGER)
@ApiTags('movies-manager')
@ApiBearerAuth('ApiKeyAuth')
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
