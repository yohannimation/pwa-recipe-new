import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { SpoonacularService } from './spoonacular.service';

/**
 * |=======================================================================================|
 * |   CREATE, UPDATE, DELETE are does automatically when a recipe is CREATED or UPDATED   |
 * |=======================================================================================|
 */

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly spoonacularService: SpoonacularService) {}

  @Get()
  async searchIngredients(@Query('name') name: string) {
    if (!name) {
      throw new BadRequestException('name query parameter is required');
    }
    return this.spoonacularService.searchIngredients(name);
  }
}
