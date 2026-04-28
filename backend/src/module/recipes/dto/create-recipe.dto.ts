import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  imageName?: string;

  @IsInt()
  @IsNotEmpty()
  preparationTime: number;

  @IsInt()
  @IsNotEmpty()
  cookTime: number;

  @IsInt()
  @IsNotEmpty()
  numberPeople: number;

  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
