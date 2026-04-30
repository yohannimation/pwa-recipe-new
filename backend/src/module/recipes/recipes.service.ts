import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

// Entities
import { Category } from '../categories/entities/category.entity';
import { Recipe } from './entities/recipe.entity';
import { Step } from '../steps/entities/step.entity';
import { User } from '../users/entities/user.entity';

// DTOs
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

// Services
import { UsersService } from '../users/users.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Step)
    private readonly stepRepository: Repository<Step>,
    private readonly usersService: UsersService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto, currentUser: User) {
    // Fetch user entity to create relation between recipe - user
    const user = await this.usersService.findOne(currentUser.id);

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

    // Steps - Cascade insertion
    if (createRecipeDto.steps && createRecipeDto.steps.length > 0) {
      recipe.steps = createRecipeDto.steps.map((stepDto) =>
        this.stepRepository.create(stepDto),
      );
    }

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
      const categories = await this.categoryRepository.findBy({
        id: In(updateRecipeDto.categoryIds),
      });
      updatedRecipe.categories = categories;
    }

    // Ingredients
    // TODO add ingredients

    // Steps deletion
    if (updateRecipeDto.steps) {
      const updatedStepIds = updateRecipeDto.steps
        .filter((stepDto) => stepDto.id)
        .map((stepDto) => stepDto.id);

      const orphanedSteps = await this.stepRepository.findBy({
        recipe: { id },
      });

      if (updatedStepIds.length > 0) {
        const toDelete = orphanedSteps.filter(
          (step) => !updatedStepIds.includes(step.id),
        );
        if (toDelete.length > 0) {
          await this.stepRepository.remove(toDelete);
        }
      } else {
        if (orphanedSteps.length > 0) {
          await this.stepRepository.remove(orphanedSteps);
        }
      }

      updatedRecipe.steps = updateRecipeDto.steps.map((stepDto) => {
        if (stepDto.id) {
          // Step update
          return this.stepRepository.merge(
            { id: stepDto.id, recipe } as Step,
            stepDto,
          );
        } else {
          // Step creation
          return this.stepRepository.create({
            ...stepDto,
            recipe,
          });
        }
      });
    }

    await this.recipeRepository.save(updatedRecipe);
    return this.findOne(id);
  }

  async remove(id: number) {
    const recipe = await this.findOne(id);
    await this.recipeRepository.remove(recipe);
  }
}
