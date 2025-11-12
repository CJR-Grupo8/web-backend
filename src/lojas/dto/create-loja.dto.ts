import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateLojaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsInt()
  @IsNotEmpty()
  donoId: number;
}
