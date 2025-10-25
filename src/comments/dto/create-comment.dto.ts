import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
