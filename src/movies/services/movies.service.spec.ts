import { Movie } from '@prisma/client';
import { MoviesService } from './movies.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../crud/prisma.service';

describe('MoviesService', () => {
  let prismaService: PrismaService;
  let moviesService: MoviesService;
  let movie: Movie = {
    id: '1',
    name: 'test',
    ageRestriction: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: PrismaService,
          useValue: {
            movie: {
              findMany: jest.fn(() => [movie]),
              create: jest.fn(() => movie),
              deleteMany: jest.fn(() => ({
                count: 2,
              })),
              createMany: jest.fn(() => ({
                count: 2,
              })),
            },
          },
        },
      ],
    }).compile();

    moviesService = module.get<MoviesService>(MoviesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('get all Movies', () => {
    it('returns an array of movies', async () => {
      expect(await moviesService.findAll()).toEqual([movie]);
      expect(prismaService.movie.findMany).toHaveBeenCalled();
    });
  });

  describe('get filtered movies', () => {
    it('returns an array of movies', async () => {
      expect(await moviesService.findFiltered(null, null)).toEqual([movie]);
      expect(prismaService.movie.findMany).toHaveBeenCalled();
    });
  });

  describe('create Movie', () => {
    it('returns a new movie', async () => {
      expect(await moviesService.create(movie)).toEqual(movie);
      expect(prismaService.movie.create).toHaveBeenCalled();
    });
  });

  describe('batch operations', () => {
    it('batch create', async () => {
      expect(await moviesService.createBatch([movie, movie])).toStrictEqual({
        count: 2,
      });
      expect(prismaService.movie.createMany).toHaveBeenCalled();
    });
    it('batch delete', async () => {
      expect(
        await moviesService.deleteBatch([movie.id, movie.id]),
      ).toStrictEqual({
        count: 2,
      });
      expect(prismaService.movie.deleteMany).toHaveBeenCalled();
    });
  });
});
