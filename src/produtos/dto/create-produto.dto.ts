import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, Min } from 'class-validator';

export class CreateProdutoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  preco: number;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  estoque?: number;

  @IsInt()
  @IsNotEmpty()
  lojaId: number;
}
