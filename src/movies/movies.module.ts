import { Module } from '@nestjs/common';
import { MoviesController } from './controllers/movies.controller';
import { MoviesService } from './services/movies.service';
import { MoviesManagerController } from './controllers/movies.manager.controller';

@Module({
  imports: [],
  controllers: [MoviesController, MoviesManagerController],
  providers: [MoviesService],
})
export class MoviesModule {}
