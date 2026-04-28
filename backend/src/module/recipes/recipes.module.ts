import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Recipe } from './entities/recipe.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, Category])],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
