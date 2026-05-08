import { Module } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Category } from '../categories/entities/category.entity';
import { Step } from '../steps/entities/step.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';

// Modules
import { StepsModule } from '../steps/steps.module';
import { UsersModule } from '../users/users.module';
import { IngredientsModule } from '../ingredients/ingredients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, Category, Step, Ingredient]),
    StepsModule,
    IngredientsModule,
    UsersModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
