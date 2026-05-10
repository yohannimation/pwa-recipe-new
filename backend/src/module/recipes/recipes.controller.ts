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
  BadRequestException,
  Req,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Recipe } from './entities/recipe.entity';
import { Role } from '../../common/enums/role.enum';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';

@ApiTags('Recipes')
@Controller('recipes')
@ApiBearerAuth()
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CHEF)
  @ApiOperation({ summary: 'Create a recipe' })
  @ApiResponse({ status: 201, type: Recipe, description: 'Recipe created' })
  create(@Body() createRecipeDto: CreateRecipeDto, @CurrentUser() user: User) {
    return this.recipesService.create(createRecipeDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recipes' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter by recipe name',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  @ApiResponse({ status: 200, type: [Recipe] })
  findAll(@Query('name') name?: string, @Query('category') category?: string) {
    return this.recipesService.findAll({ name, category });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recipe by ID' })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({ status: 200, type: Recipe })
  @ApiResponse({ status: 404, description: 'Recipe not found' })
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CHEF)
  @ApiOperation({ summary: 'Update a recipe' })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({ status: 200, type: Recipe })
  @ApiResponse({ status: 403, description: 'Forbidden' })
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
  @ApiOperation({ summary: 'Delete a recipe' })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({ status: 200, description: 'Recipe deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    const recipe = await this.recipesService.findOne(+id);

    if (user.role !== Role.ADMIN && recipe.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    return this.recipesService.remove(+id);
  }

  @Post(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CHEF)
  @ApiOperation({ summary: 'Upload recipe image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Recipe ID' })
  @ApiResponse({ status: 200, type: Recipe })
  @ApiResponse({ status: 400, description: 'No file received' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async uploadImage(
    @Param('id') id: number,
    @Req() req: FastifyRequest,
    @CurrentUser() user: User,
  ) {
    const file = await req.file();
    if (!file) throw new BadRequestException('No file received');

    const recipe = await this.recipesService.findOne(+id);

    if (user.role !== Role.ADMIN && recipe.user.id !== user.id) {
      throw new ForbiddenException(
        'You can only upload image for your own recipes',
      );
    }

    return this.recipesService.updateImage(id, file);
  }
}
