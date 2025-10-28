import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service'; 
import * as bcrypt from 'bcrypt'; 
import { UserPayload } from './types/UserPayload'; 
import { JwtService } from '@nestjs/jwt'; 
import { UserToken } from './types/UserToken'; 
import { LoginRequestBodyDto } from './dto/loginRequestBody.dto'; 
import { User } from '@prisma/client'; 

@Injectable()
export class AuthService {
    constructor(
    
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

   

    async validateUser(email: string, pass: string): Promise<Omit<User, 'senha'> | null> {
 
        const user = await this.usersService.findByEmail(email);

        if (user) {
         
            const isPasswordValid = await bcrypt.compare(pass, user.senha);

            if (isPasswordValid) {
              
                const { senha, ...result } = user;
                return result;
            }
        }
     
        return null;
    }

   
    async login(loginRequestBody: LoginRequestBodyDto): Promise<UserToken> {
      
        const user = await this.validateUser(loginRequestBody.email, loginRequestBody.password);

        
        if (!user) {
            throw new UnauthorizedException('Usuário ou senha incorretos');
        }

      
        const payload: UserPayload = {
            sub: user.id, 
            email: user.email,
            
        };


        const jwtToken = await this.jwtService.signAsync(payload);

        // 5. Retorna o token para o frontend
        return {
            access_token: jwtToken,
        };
    }
}