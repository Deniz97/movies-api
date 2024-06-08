import { Movie, PrismaClient } from '@prisma/client';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import {
  MongoDBContainer,
  StartedMongoDBContainer,
} from '@testcontainers/mongodb';

describe('CatsController', () => {
  let catsController: MoviesController;
  let moviesService: MoviesService;
  let mongoContainer: StartedMongoDBContainer;
  let prisma;

  beforeAll(async () => {
    mongoContainer = await new MongoDBContainer().start();
    const logs = await mongoContainer.logs();
    console.log('MongoDB logs:', logs);
    const connectionString = mongoContainer.getConnectionString() + '/?retryWrites=true&w=majority';
    process.env.DATABASE_URL = connectionString;
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    console.log('Attempting to disconnect Prisma...');
    await prisma.$disconnect();
    await mongoContainer.stop();
    console.log('Prisma disconnected.');
  });
  beforeEach(() => {
    moviesService = new MoviesService(prisma);
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movieData = {
        name: 'Test Movie',
        ageRestriction: 13,
      };

      console.log('Creating movie...');
      const createdMovie = await prisma.movie.create({
        data: movieData,
      });
      console.log('Movie created:', createdMovie);

      const movies = await prisma.movie.findMany();
      console.log('Movies found:', movies);
      expect(movies.length).toBeGreaterThan(0);
    });
  });
});
