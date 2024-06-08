import { Movie } from '@prisma/client';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('CatsController', () => {
  let catsController: MoviesController;
  let moviesService: MoviesService;

  beforeEach(() => {
    moviesService = new MoviesService(null);
    catsController = new MoviesController(moviesService);
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

      expect(await catsController.getMovies()).toBe(result);
    });
  });
});
