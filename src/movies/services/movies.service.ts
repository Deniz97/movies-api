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
}
