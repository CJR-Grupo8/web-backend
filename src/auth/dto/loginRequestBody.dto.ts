import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestBodyDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'Informe o e-mail.' })
  email: string;

  @IsString({ message: 'Senha inválida.' })
  @IsNotEmpty({ message: 'Informe a senha.' })
  password: string;
}
