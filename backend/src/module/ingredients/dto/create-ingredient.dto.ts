import { IsString, IsOptional } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsOptional()
  idApi?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsString()
  quantity: string;

  @IsString()
  unit: string;
}
