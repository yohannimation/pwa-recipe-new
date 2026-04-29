import { PartialType } from '@nestjs/mapped-types';
import { BaseCreateRecipeDto } from './create-recipe.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateStepDto } from 'src/module/steps/dto/update-step.dto';

export class UpdateRecipeDto extends PartialType(BaseCreateRecipeDto) {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateStepDto)
  steps?: UpdateStepDto[];
}
