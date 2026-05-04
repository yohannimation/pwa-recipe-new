export interface SpoonacularIngredient {
  food_id: string;
  name: string;
  image?: string;
}

export interface SpoonacularSearchDataResponse {
  id: string;
  name: string;
  image?: string;
}

export interface SpoonacularSearchResponse {
  results: SpoonacularSearchDataResponse[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface SpoonacularErrorResponse {
  status: string;
  code: number;
  message: string;
}
