import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { buildTypeOrmConfig } from './config/typeorm.config';

import { AuthModule } from './module/auth/auth.module';
import { UsersModule } from './module/users/users.module';
import { CategoriesModule } from './module/categories/categories.module';
import { RecipesModule } from './module/recipes/recipes.module';
import { IngredientsModule } from './module/ingredients/ingredients.module';
import { StepsModule } from './module/steps/steps.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        buildTypeOrmConfig(configService),
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    RecipesModule,
    IngredientsModule,
    StepsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
