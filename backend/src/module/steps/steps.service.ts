import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Step } from './entities/step.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StepsService {
  constructor(
    @InjectRepository(Step)
    private readonly stepRepository: Repository<Step>,
  ) {}

  async create(createStepDto: CreateStepDto) {
    return await this.stepRepository.save(createStepDto);
  }

  async findAll() {
    return await this.stepRepository.find();
  }

  async findOne(id: number) {
    const step = await this.stepRepository.findOneBy({ id });
    if (!step) throw new NotFoundException(`Step with ID ${id} not found`);

    return step;
  }

  async update(id: number, updateStepDto: UpdateStepDto) {
    const step = await this.findOne(id);
    const updatedStep = this.stepRepository.merge(step, updateStepDto);

    return await this.stepRepository.save(updatedStep);
  }

  async remove(id: number) {
    const step = await this.findOne(id);
    await this.stepRepository.remove(step);
  }

  async updateStepsByRecipe(recipeId: number, stepsDto: UpdateStepDto[]) {
    // Identify steps that are being updated (those with an existing ID)
    const updatedStepIds = stepsDto
      .filter((stepDto) => stepDto.id)
      .map((stepDto) => stepDto.id);

    // Find all current steps associated with this recipe to identify orphans
    const orphanedSteps = await this.stepRepository.findBy({
      recipe: { id: recipeId },
    });

    // Remove steps that are no longer present in the updated list
    if (updatedStepIds.length > 0) {
      const toDelete = orphanedSteps.filter(
        (step) => !updatedStepIds.includes(step.id),
      );
      if (toDelete.length > 0) {
        await this.stepRepository.remove(toDelete);
      }
    } else {
      // If no steps are being updated, remove all existing steps for this recipe
      if (orphanedSteps.length > 0) {
        await this.stepRepository.remove(orphanedSteps);
      }
    }

    // Prepare the list of steps to be saved (merge existing or create new)
    return stepsDto.map((stepDto) => {
      if (stepDto.id) {
        return this.stepRepository.merge(
          { id: stepDto.id, recipe: { id: recipeId } } as Step,
          stepDto,
        );
      } else {
        return this.stepRepository.create({
          ...stepDto,
          recipe: { id: recipeId },
        });
      }
    });
  }
}
