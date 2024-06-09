import { Controller, Get } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { UserRole } from '@prisma/client';
import { Roles } from '../../guards/decorators';

@Controller('movies')
@Roles(UserRole.CUSTOMER)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies() {
    return this.moviesService.findAll();
  }
}
