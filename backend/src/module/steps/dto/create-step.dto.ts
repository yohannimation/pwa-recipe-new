import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStepDto {
  @ApiProperty({ example: 1, description: 'Step number', minimum: 1 })
  @IsInt()
  @Min(1)
  stepNumber: number;

  @ApiProperty({
    example: 'Mix the floor with eggs',
    description: 'Step description',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(8192)
  description: string;

  @ApiProperty({
    example: 1,
    description: 'ID recipe associated',
    required: false,
  })
  @IsInt()
  @IsOptional()
  recipeId?: number;
}
