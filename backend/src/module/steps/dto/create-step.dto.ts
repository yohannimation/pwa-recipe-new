import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateStepDto {
  @IsInt()
  @Min(1)
  stepNumber: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8192)
  description: string;

  @IsInt()
  @IsOptional()
  recipeId?: number;
}
