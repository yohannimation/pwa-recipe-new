import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateIngredientDto {
  @ApiProperty({
    example: '12345',
    description: 'ID API Spoonacular',
    required: false,
  })
  @IsString()
  @IsOptional()
  idApi?: string;

  @ApiProperty({ example: 'Floor', description: 'Ingredient name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://example.com/flour.jpg',
    description: 'Image url',
    required: false,
  })
  @IsString()
  @IsOptional()
  imgUrl?: string;

  @ApiProperty({ example: '200', description: 'Quantity' })
  @IsString()
  quantity: string;

  @ApiProperty({ example: 'g', description: 'Unit' })
  @IsString()
  unit: string;
}
