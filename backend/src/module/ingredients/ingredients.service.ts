import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SpoonacularService } from './spoonacular.service';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    private readonly spoonacularService: SpoonacularService,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    return await this.ingredientRepository.save(createIngredientDto);
  }

  async findAll() {
    return await this.ingredientRepository.find();
  }

  async findOne(id: number) {
    const ingredient = await this.ingredientRepository.findOneBy({ id });
    if (!ingredient)
      throw new NotFoundException(`Ingredient with ID ${id} not found`);

    return ingredient;
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.findOne(id);
    const updatedIngredient = this.ingredientRepository.merge(
      ingredient,
      updateIngredientDto,
    );

    return await this.ingredientRepository.save(updatedIngredient);
  }

  async remove(id: number) {
    const ingredient = await this.findOne(id);
    await this.ingredientRepository.remove(ingredient);
  }

  async searchFromFatSecret(query: string) {
    return this.spoonacularService.searchIngredients(query);
  }
}
