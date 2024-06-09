import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Anonymous } from '../guards/decorators';
import { LoginRequest } from './dtos/LoginRequest';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth('ApiKeyAuth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Anonymous()
  signIn(@Body() loginRequest: LoginRequest) {
    return this.authService.signIn(loginRequest.email, loginRequest.password);
  }
}
