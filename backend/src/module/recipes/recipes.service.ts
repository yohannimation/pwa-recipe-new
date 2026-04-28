import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, user: User) {
    const recipe = this.recipeRepository.create({
      ...createRecipeDto,
      user,
    });

    // Categories
    if (createRecipeDto.categoryIds && createRecipeDto.categoryIds.length > 0) {
      const categories = await this.categoryRepository.findBy({
        id: In(createRecipeDto.categoryIds),
      });
      recipe.categories = categories;
    }

    // Ingredients
    // TODO add ingredients

    // Steps
    // TODO add steps

    const savedRecipe = await this.recipeRepository.save(recipe);
    return this.findOne(+savedRecipe.id);
  }

  async findAll(query: { name?: string; category?: string }) {
    const { name, category } = query;

    const queryBuilder = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.user', 'user')
      .leftJoinAndSelect('recipe.categories', 'category')
      .leftJoinAndSelect('recipe.ingredients', 'ingredient')
      .leftJoinAndSelect('recipe.steps', 'step');

    if (name)
      queryBuilder.andWhere('recipe.name ILIKE :name', { name: `%${name}%` });

    if (category)
      queryBuilder.andWhere('category.name ILIKE :category', {
        category: `%${category}%`,
      });

    return await queryBuilder.getMany();
  }

  async findOne(id: number) {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['user', 'categories', 'ingredients', 'steps'],
    });
    if (!recipe) throw new NotFoundException(`Recipe with ID ${id} not found`);

    return recipe;
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const recipe = await this.findOne(id);

    const updatedRecipe = this.recipeRepository.merge(recipe, updateRecipeDto);

    // Categories
    if (updateRecipeDto.categoryIds && updateRecipeDto.categoryIds.length > 0) {
      const categories = await this.categoryRepository.findByIds(
        updateRecipeDto.categoryIds,
      );
      updatedRecipe.categories = categories;
    }

    // Ingredients
    // TODO add ingredients

    // Steps
    // TODO add steps

    return await this.recipeRepository.save(updatedRecipe);
  }

  async remove(id: number) {
    const recipe = await this.findOne(id);
    await this.recipeRepository.remove(recipe);
  }
}
