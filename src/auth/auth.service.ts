import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UserPayload } from './types/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserToken } from './types/UserToken';
import { LoginRequestBodyDto } from './dto/loginRequestBody.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginRequestBody: LoginRequestBodyDto): Promise<UserToken> {
    const user = await this.validateUser(
      loginRequestBody.email,
      loginRequestBody.password,
    );

    const payload: UserPayload = { email: user.email, sub: String(user.id) };

    const jwtToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1d',
    });

    return {
      access_token: jwtToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      // email não encontrado
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // senha não bate
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
