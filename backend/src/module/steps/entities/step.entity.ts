import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('steps')
export class Step {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 1 })
  stepNumber: number;

  @Column('text')
  @ApiProperty({ example: 'Mix floor with eggs' })
  description: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.steps, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Recipe })
  recipe: Recipe;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;
}
