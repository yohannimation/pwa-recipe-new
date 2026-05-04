import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SpoonacularIngredient,
  SpoonacularSearchResponse,
  SpoonacularErrorResponse,
  SpoonacularSearchDataResponse,
} from './interfaces/spoonacular-ingredient.interface';

@Injectable()
export class SpoonacularService {
  private readonly logger = new Logger(SpoonacularService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly imageBaseUrl =
    'https://spoonacular.com/cdn/ingredients_100x100';

  constructor(private readonly configService: ConfigService) {
    this.apiUrl = 'https://api.spoonacular.com/food/ingredients/search';
    this.apiKey = this.configService.get<string>('SPOONACULAR_API_KEY') ?? '';

    if (!this.apiKey) {
      this.logger.warn('Spoonacular API key not configured');
    }
  }

  async searchIngredients(query: string): Promise<SpoonacularIngredient[]> {
    try {
      const url = new URL(this.apiUrl);
      url.searchParams.set('apiKey', this.apiKey);
      url.searchParams.set('query', query);
      url.searchParams.set('number', '30');

      const response = await fetch(url.toString());

      if (!response.ok) {
        const error = (await response.json()) as SpoonacularErrorResponse;
        throw new Error(`Spoonacular error ${error.code}: ${error.message}`);
      }

      const data = (await response.json()) as SpoonacularSearchResponse;

      return data.results.map((item: SpoonacularSearchDataResponse) => ({
        food_id: item.id,
        name: item.name,
        image_url: item.image
          ? `${this.imageBaseUrl}/${item.image}`
          : undefined,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;

      this.logger.error(`Error searching ingredients: ${message}`, stack);
      throw new Error(`Spoonacular API error: ${message}`);
    }
  }
}
