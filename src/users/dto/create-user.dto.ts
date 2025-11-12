import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';


export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[A-Z]/)
  @Matches(/[a-z]/)
  @Matches(/[0-9]/)
  password: string;
}
