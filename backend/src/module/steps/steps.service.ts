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
}
