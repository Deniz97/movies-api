import { Movie } from '@prisma/client';
import { MoviesController } from './movies.controller';
import { MoviesService } from '../services/movies.service';
import { HttpException } from '@nestjs/common';

describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;
  const movie: Movie = {
    id: '1',
    name: 'test',
    ageRestriction: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    moviesService = new MoviesService(null);
    moviesController = new MoviesController(moviesService);
    // TODO reset the spy here for good practice?
  });

  describe('get Movies', () => {
    it('should return an array of movies', async () => {
      jest
        .spyOn(moviesService, 'findFiltered')
        .mockImplementation(() => Promise.resolve([movie]));

      expect(
        await moviesController.getMovies(
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      ).toStrictEqual([movie]);
      expect(moviesService.findFiltered).toHaveBeenCalled();
      expect(moviesService.findFiltered).toHaveBeenCalledWith(null, null);
    });

    it('should fail when filter keys are not properly filled', async () => {
      jest
        .spyOn(moviesService, 'findFiltered')
        .mockImplementation(() => Promise.resolve([movie]));

      expect(() =>
        moviesController.getMovies(
          'filterField',
          undefined,
          undefined,
          undefined,
        ),
      ).toThrow(HttpException);
    });

    it('should fail when sort keys are not properly filled', async () => {
      jest
        .spyOn(moviesService, 'findFiltered')
        .mockImplementation(() => Promise.resolve([movie]));

      expect(() =>
        moviesController.getMovies(
          'filterField',
          'filterKey',
          'sortField',
          undefined,
        ),
      ).toThrow(HttpException);
    });

    it('should work when keys are properly filled', async () => {
      jest
        .spyOn(moviesService, 'findFiltered')
        .mockImplementation(() => Promise.resolve([movie]));

      expect(
        await moviesController.getMovies(
          'filterField',
          'filterKey',
          'sortField',
          'asc',
        ),
      ).toStrictEqual([movie]);
      expect(moviesService.findFiltered).toHaveBeenCalledWith(
        { field: 'filterField', key: 'filterKey' },
        { field: 'sortField', order: 'asc' },
      );
    });

    it('should throw when wrong sort order key is given', async () => {
      jest
        .spyOn(moviesService, 'findFiltered')
        .mockImplementation(() => Promise.resolve([movie]));

      expect(() =>
        moviesController.getMovies(
          'filterField',
          'filterKey',
          'sortField',
          'sortOrder',
        ),
      ).toThrow(HttpException);
      expect(moviesService.findFiltered).not.toHaveBeenCalled();
    });
  });
});
