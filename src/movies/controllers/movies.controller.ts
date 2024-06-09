import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { UserRole } from '@prisma/client';
import { Roles } from '../../guards/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('movies')
@Roles(UserRole.CUSTOMER)
@ApiTags('movies')
@ApiBearerAuth('ApiKeyAuth')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovies(
    @Query('filterField') filterField: string,
    @Query('filterKey') filterKey: string,
    @Query('sortField') sortField: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    if (!filterField !== !filterKey) {
      throw new HttpException(
        'Filter field and key must be provided together',
        400,
      );
    }
    if (!sortField !== !sortOrder) {
      throw new HttpException(
        'Sort field and order must be provided together',
        400,
      );
    }
    if (sortOrder && sortOrder !== 'asc' && sortOrder !== 'desc') {
      throw new HttpException('Sort order must be either asc or desc', 400);
    }
    return this.moviesService.findFiltered(
      filterField ? { field: filterField, key: filterKey } : null,
      sortField ? { field: sortField, order: sortOrder } : null,
    );
  }
}
