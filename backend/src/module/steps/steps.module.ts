import { Module } from '@nestjs/common';
import { StepsService } from './steps.service';
import { StepsController } from './steps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Step } from './entities/step.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Step])],
  controllers: [StepsController],
  providers: [StepsService],
})
export class StepsModule {}
