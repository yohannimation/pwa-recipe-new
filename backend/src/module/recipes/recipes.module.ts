import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Category } from '../categories/entities/category.entity';
import { StepsModule } from '../steps/steps.module';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Category]), StepsModule],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
