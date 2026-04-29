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

export class BaseCreateRecipeDto {
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

export class CreateRecipeDto extends BaseCreateRecipeDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps?: CreateStepDto[];
}
