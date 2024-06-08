import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MoviesManagerController } from './movies.manager.controller';

@Module({
  imports: [],
  controllers: [MoviesController, MoviesManagerController],
  providers: [MoviesService],
})
export class MoviesModule {}
