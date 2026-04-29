import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('steps')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.CHEF)
  create(@Body() createStepDto: CreateStepDto) {
    return this.stepsService.create(createStepDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.stepsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.stepsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.CHEF)
  update(@Param('id') id: string, @Body() updateStepDto: UpdateStepDto) {
    return this.stepsService.update(+id, updateStepDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.CHEF)
  remove(@Param('id') id: string) {
    return this.stepsService.remove(+id);
  }
}
