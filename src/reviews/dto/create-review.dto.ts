import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max, ValidateIf } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  @IsOptional()
  @ValidateIf((o) => !o.produtoId)
  @IsNotEmpty({ message: 'lojaId ou produtoId deve ser fornecido' })
  lojaId?: number;

  @IsInt()
  @IsOptional()
  @ValidateIf((o) => !o.lojaId)
  @IsNotEmpty({ message: 'lojaId ou produtoId deve ser fornecido' })
  produtoId?: number;
}
