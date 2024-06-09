import { Movie } from '@prisma/client';
import { MoviesService } from '../services/movies.service';
import { MoviesManagerController } from './movies.manager.controller';

describe('MoviesManagerController', () => {
  let moviesManagerController: MoviesManagerController;
  let moviesService: MoviesService;
  const movie: Movie = {
    id: '1',
    name: 'test',
    ageRestriction: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const movie2: Movie = {
    id: '2',
    name: 'test2',
    ageRestriction: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    moviesService = new MoviesService(null);
    moviesManagerController = new MoviesManagerController(moviesService);
  });

  describe('get Movies', () => {
    it('should return an array of movies', async () => {
      const result: Movie[] = [
        {
          id: '1',
          name: 'test',
          ageRestriction: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest
        .spyOn(moviesService, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await moviesManagerController.getMovies()).toBe(result);
    });
  });

  describe('create Movie', () => {
    it('should return the created movie', async () => {
      jest
        .spyOn(moviesService, 'create')
        .mockImplementation(() => Promise.resolve(movie));
      const createMovieDto = {
        name: 'test',
        ageRestriction: 1,
      };
      expect(await moviesManagerController.createMovie(createMovieDto)).toBe(
        movie,
      );
    });
  });

  describe('create batch', () => {
    it('should return the created movie count', async () => {
      moviesService.createBatch = jest.fn().mockResolvedValue({ count: 2 });
      const createMovieDto = {
        name: movie.name,
        ageRestriction: movie.ageRestriction,
      };
      const createMovieDto2 = {
        name: movie.name,
        ageRestriction: movie.ageRestriction,
      };
      expect(
        await moviesManagerController.createMovies([
          createMovieDto,
          createMovieDto2,
        ]),
      ).toStrictEqual({ count: 2 });
      expect(moviesService.createBatch).toHaveBeenCalled();
    });
  });

  describe('delete batch', () => {
    it('should return the deleted movie count', async () => {
      moviesService.deleteBatch = jest.fn().mockResolvedValue({ count: 2 });
      const ids = [movie.id, movie2.id];
      expect(
        await moviesManagerController.deleteMovies({ ids: ids }),
      ).toStrictEqual({
        count: 2,
      });
      expect(moviesService.deleteBatch).toHaveBeenCalledWith(ids);
    });
  });
});
