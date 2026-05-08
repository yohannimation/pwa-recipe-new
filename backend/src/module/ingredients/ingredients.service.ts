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

  async updateIngredientsByRecipe(
    recipeId: number,
    ingredientsDto: UpdateIngredientDto[],
  ) {
    // Identify ingredients that are being updated (those with an existing ID)
    const updatedIngredientIds = ingredientsDto
      .filter((ingredientDto) => ingredientDto.id)
      .map((ingredientDto) => ingredientDto.id);

    // Find all current ingredients associated with this recipe to identify orphans
    const orphanedIngredients = await this.ingredientRepository.findBy({
      recipe: { id: recipeId },
    });

    // Remove ingredients that are no longer present in the updated list
    if (updatedIngredientIds.length > 0) {
      const toDelete = orphanedIngredients.filter(
        (ing) => !updatedIngredientIds.includes(ing.id),
      );
      if (toDelete.length > 0) {
        await this.ingredientRepository.remove(toDelete);
      }
    } else {
      // If no ingredients are being updated, remove all existing ingredients for this recipe
      if (orphanedIngredients.length > 0) {
        await this.ingredientRepository.remove(orphanedIngredients);
      }
    }

    // Prepare the list of ingredients to be saved (merge existing or create new)
    return ingredientsDto.map((ingredientDto) => {
      if (ingredientDto.id) {
        return this.ingredientRepository.merge(
          { id: ingredientDto.id, recipe: { id: recipeId } } as Ingredient,
          ingredientDto,
        );
      } else {
        return this.ingredientRepository.create({
          ...ingredientDto,
          recipe: { id: recipeId },
        });
      }
    });
  }
}
