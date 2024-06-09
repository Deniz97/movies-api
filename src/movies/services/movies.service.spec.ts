import { Movie, PrismaClient } from '@prisma/client';
import { MoviesService } from './movies.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../crud/prisma.service';

describe('MoviesService', () => {
  let prismaService: PrismaService;
  let moviesService: MoviesService;
  let movie: Movie;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              findMany: jest.fn(() => []),
              create: jest.fn(() => movie),
            },
          },
        },
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    prismaService = module.get<PrismaService>(PrismaService);
    movie = {
      id: '1',
      name: 'test',
      ageRestriction: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  describe('#findAll', () => {
    it('returns an array of movies', async () => {
      expect(await moviesService.findAll()).toEqual([]);
      expect(prismaService.movie.findMany).toHaveBeenCalled();
    });
  });

  describe('#create', () => {
    it('returns a new movie', async () => {
      expect(await moviesService.create(movie)).toEqual(movie);
      expect(prismaService.movie.create).toHaveBeenCalled();
    });
  });
});
