import { Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  HttpStatus, 
  HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/auth/guards/auth-guard';
import { LoginRequestBodyDto } from './dto/loginRequestBody.dto'; 
import { UserToken } from './types/UserToken'; 
import { STATUS_CODES } from 'http';
import { Public } from './decorators/isPublic.decorator';


@Controller('auth') 
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK) 
  @Post('login') 
  async login(@Body() loginRequestBody: LoginRequestBodyDto){
    return this.authService.login(loginRequestBody);
  }

  
  
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }


  }
