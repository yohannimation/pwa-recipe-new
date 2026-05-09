import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { MultipartFile } from '@fastify/multipart';

// Entities
import { Category } from '../categories/entities/category.entity';
import { Recipe } from './entities/recipe.entity';
import { Step } from '../steps/entities/step.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { User } from '../users/entities/user.entity';

// DTOs
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

// Services
import { UsersService } from '../users/users.service';
import { StepsService } from '../steps/steps.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Step)
    private readonly stepRepository: Repository<Step>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,

    private readonly usersService: UsersService,
    private readonly stepsService: StepsService,
    private readonly ingredientsService: IngredientsService,
    private readonly uploadService: UploadService,
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

    // Ingredients - Cascade insertion
    if (createRecipeDto.ingredients && createRecipeDto.ingredients.length > 0) {
      recipe.ingredients = createRecipeDto.ingredients.map((ingredientDto) =>
        this.ingredientRepository.create(ingredientDto),
      );
    }

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

    // Ingredients update
    if (updateRecipeDto.ingredients) {
      updatedRecipe.ingredients =
        await this.ingredientsService.updateIngredientsByRecipe(
          id,
          updateRecipeDto.ingredients,
        );
    }

    // Steps update
    if (updateRecipeDto.steps) {
      updatedRecipe.steps = await this.stepsService.updateStepsByRecipe(
        id,
        updateRecipeDto.steps,
      );
    }

    await this.recipeRepository.save(updatedRecipe);
    return this.findOne(id);
  }

  async remove(id: number) {
    const recipe = await this.findOne(id);
    await this.recipeRepository.remove(recipe);
  }

  async updateImage(id: number, file: MultipartFile): Promise<Recipe> {
    const recipe = await this.findOne(id);

    this.uploadService.checkFormat(file);

    // Remove old recipe image if exist
    if (recipe.imageName) this.uploadService.removeImage(recipe.imageName);

    const filename = await this.uploadService.saveImage(file);
    recipe.imageName = filename;

    return this.recipeRepository.save(recipe);
  }
}
