import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsInt()
  lojaId?: number;

  @IsOptional()
  @IsInt()
  produtoId?: number;

  @IsOptional()
  @IsInt()
  authorId?: number;
}
