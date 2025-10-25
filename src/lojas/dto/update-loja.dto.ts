import { PartialType } from '@nestjs/mapped-types';
import { CreateLojaDto } from './create-loja.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateLojaDto extends PartialType(CreateLojaDto) {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}
