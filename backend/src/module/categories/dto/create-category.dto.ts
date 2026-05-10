import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Desserts',
    description: 'Category name',
    minLength: 2,
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(128)
  name: string;

  @ApiProperty({
    example: 1,
    description: 'ID category parent',
    required: false,
  })
  @IsOptional()
  @IsInt()
  idParent?: number;
}
