import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CHEF)
  create(@Body() createRecipeDto: CreateRecipeDto, @CurrentUser() user: User) {
    return this.recipesService.create(createRecipeDto, user);
  }

  @Get()
  findAll(@Query('name') name?: string, @Query('category') category?: string) {
    return this.recipesService.findAll({ name, category });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CHEF)
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @CurrentUser() user: User,
  ) {
    const recipe = await this.recipesService.findOne(+id);

    if (user.role !== Role.ADMIN && recipe.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CHEF)
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const recipe = await this.recipesService.findOne(+id);

    if (user.role !== Role.ADMIN && recipe.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    return this.recipesService.remove(+id);
  }
}
