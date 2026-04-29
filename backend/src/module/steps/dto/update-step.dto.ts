import { PartialType } from '@nestjs/mapped-types';
import { CreateStepDto } from './create-step.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateStepDto extends PartialType(CreateStepDto) {
  @IsInt()
  @Min(1)
  @IsOptional()
  id?: number;
}
