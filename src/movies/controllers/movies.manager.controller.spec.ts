import { Movie } from '@prisma/client';
import { MoviesService } from '../services/movies.service';
import { MoviesManagerController } from './movies.manager.controller';

describe('MoviesManagerController', () => {
  let moviesManagerController: MoviesManagerController;
  let moviesService: MoviesService;

  beforeEach(() => {
    moviesService = new MoviesService(null);
    moviesManagerController = new MoviesManagerController(moviesService);
  });

  describe('findAll', () => {
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

  describe('create', () => {
    it('should return the created movie', async () => {
      const movie: Movie = {
        id: '1',
        name: 'test',
        ageRestriction: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
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
});
