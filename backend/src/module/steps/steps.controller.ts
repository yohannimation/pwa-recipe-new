import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

/**
 * |=======================================================================================|
 * |   CREATE, UPDATE, DELETE are does automatically when a recipe is CREATED or UPDATED   |
 * |=======================================================================================|
 */

@Controller('steps')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StepsController {
  constructor() {}
}
