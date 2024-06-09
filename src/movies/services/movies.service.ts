import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../crud/prisma.service';
import { CreateMovieDto } from '../dtos/CreateMovieDto';
import { Movie } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.prismaService.movie.create({ data: createMovieDto });
  }
  findAll(): Promise<Movie[]> {
    return this.prismaService.movie.findMany();
  }

  findFiltered(
    filter: { field: string; key: string } | null,
    sort: { field: string; order: string } | null,
  ): Promise<Movie[]> {
    return this.prismaService.movie.findMany({
      where: {
        ...(filter
          ? {
              [filter.field]: {
                contains: filter.key,
              },
            }
          : {}),
      },

      orderBy: {
        ...(sort
          ? {
              [sort.field]: sort.order,
            }
          : {}),
      },
    });
  }
}
