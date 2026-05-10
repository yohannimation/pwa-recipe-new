import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SpoonacularService } from './spoonacular.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

/**
 * |=======================================================================================|
 * |   CREATE, UPDATE, DELETE are does automatically when a recipe is CREATED or UPDATED   |
 * |=======================================================================================|
 */

@ApiTags('Ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly spoonacularService: SpoonacularService) {}

  @Get()
  @ApiOperation({ summary: 'Search ingredients via Spoonacular API' })
  @ApiQuery({
    name: 'name',
    required: true,
    description: 'Ingredient name to search for',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns list of ingredients from Spoonacular',
  })
  @ApiResponse({ status: 400, description: 'Name parameter is required' })
  async searchIngredients(@Query('name') name: string) {
    if (!name) {
      throw new BadRequestException('name query parameter is required');
    }
    return this.spoonacularService.searchIngredients(name);
  }
}
