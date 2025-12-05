import { IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { 
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número' 
  })
  newPassword: string;
}
