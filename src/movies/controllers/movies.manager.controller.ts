import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { CreateMovieDto } from '../dtos/CreateMovieDto';
import { UserRole } from '@prisma/client';
import { Roles } from '../../guards/auth-decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteMoviesRequest } from '../dtos/DeleteMoviesRequest';
import { CreateMoviesRequest } from '../dtos/CreateMoviesRequest';

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

  @Post('/batch')
  async createMovies(
    @Body() req: CreateMoviesRequest,
  ): Promise<{ count: number }> {
    const created = await this.moviesService.createBatch(
      req.movies,
    );
    return { count: created.count };
  }

  @Delete('/batch')
  async deleteMovies(
    @Body() req: DeleteMoviesRequest,
  ): Promise<{ count: number }> {
    const deleted = await this.moviesService.deleteBatch(req.ids);
    return { count: deleted.count };
  }
}
