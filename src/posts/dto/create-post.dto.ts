import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreatePostDto {
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
