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

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({ example: '12345', required: false })
  idApi: string;

  @Column()
  @ApiProperty({ example: 'Floor' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'https://example.com/flour.jpg', required: false })
  imgUrl: string;

  @Column()
  @ApiProperty({ example: '200' })
  quantity: string;

  @Column()
  @ApiProperty({ example: 'g' })
  unit: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
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
