import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStepDto } from '../../steps/dto/create-step.dto';
import { CreateIngredientDto } from '../../ingredients/dto/create-ingredient.dto';

export class BaseCreateRecipeDto {
  @ApiProperty({ example: 'Tarte Tatin', description: 'Recipe name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'tarte-tatin.jpg',
    description: 'Image file',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageName?: string;

  @ApiProperty({ example: 30, description: 'Preparation time in minute' })
  @IsInt()
  @IsNotEmpty()
  preparationTime: number;

  @ApiProperty({ example: 45, description: 'Cook time in minute' })
  @IsInt()
  @IsNotEmpty()
  cookTime: number;

  @ApiProperty({ example: 6, description: 'Number of people' })
  @IsInt()
  @IsNotEmpty()
  numberPeople: number;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs categories',
    type: [Number],
    required: false,
  })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}

export class CreateRecipeDto extends BaseCreateRecipeDto {
  @ApiProperty({
    type: [CreateStepDto],
    description: 'Steps list of preparation',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps?: CreateStepDto[];

  @ApiProperty({
    type: [CreateIngredientDto],
    description: 'Ingredients list',
    required: false,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateIngredientDto)
  ingredients?: CreateIngredientDto[];
}
