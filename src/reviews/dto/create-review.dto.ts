import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from 'class-validator';

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
  @IsNotEmpty()
  lojaId: number;

  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
