import { Controller, Get } from '@nestjs/common';
import { Anonymous } from './guards/auth-decorators';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Anonymous()
  getHello(): string {
    return 'Hello World!';
  }
}
