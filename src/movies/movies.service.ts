import { Injectable } from '@nestjs/common';
import { PrismaService } from '../crud/prisma.service';
import { CreateMovieDto } from './dtos/CreateMovieDto';
import { Movie } from '@prisma/client';

@Injectable()
export class MoviesService {
  create(createMovieDto: CreateMovieDto) {
    return this.prismaService.movie.create({ data: createMovieDto });
  }
  constructor(private readonly prismaService: PrismaService) {}
  findAll(): Promise<Movie[]> {
    return this.prismaService.movie.findMany();
  }
}
