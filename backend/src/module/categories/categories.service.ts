import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.save(createCategoryDto);
  }

  async findAll(query: { name?: string }): Promise<Category[]> {
    const { name } = query;

    if (name)
      return await this.categoryRepository.find({
        relations: ['children'],
        where: { name: Like(`%${name}%`) },
      });

    return await this.categoryRepository.find({
      relations: ['children'],
      where: { idParent: IsNull() },
    });
  }

  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findById(id);
    const updatedCategory = this.categoryRepository.merge(
      category,
      updateCategoryDto,
    );

    return await this.categoryRepository.save(updatedCategory);
  }

  async remove(id: number) {
    const category = await this.findById(id);
    await this.categoryRepository.remove(category);
  }
}
