import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestBodyDto {
  @IsEmail({}, { message: 'Por favor, forneça um email válido.' })
  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  email: string;


  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha precisa ter no mínimo 6 caracteres.'}) 
  password: string;
}