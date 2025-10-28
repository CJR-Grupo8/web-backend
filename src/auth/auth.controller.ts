import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestBodyDto } from './dto/loginRequestBody.dto'; 
import { UserToken } from './types/UserToken'; 

@Controller('auth') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') 
  @HttpCode(HttpStatus.OK) 
  async login(@Body() loginRequestBody: LoginRequestBodyDto): Promise<UserToken> {

    return this.authService.login(loginRequestBody);
  }
}