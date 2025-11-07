import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, isString } from "class-validator";

export class CreateProdutoDto{
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsNumber()
  @Min(0)
  preco: number;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;

  @IsNumber()
  @Min(0)
  quantidade: number;
  
  @IsOptional()
  @IsNumber()
  avaliacao?: number;

  @IsNumber()
  lojaId: number;
}
