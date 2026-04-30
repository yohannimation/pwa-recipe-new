import { Module } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Category } from '../categories/entities/category.entity';

// Modules
import { StepsModule } from '../steps/steps.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipe, Category]),
    StepsModule,
    UsersModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService],
  exports: [RecipesService],
})
export class RecipesModule {}
