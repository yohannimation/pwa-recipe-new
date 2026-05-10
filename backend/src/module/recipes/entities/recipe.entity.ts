import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';
import { Step } from '../../steps/entities/step.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'Tarte Tatin' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'tarte-tatin.jpg', required: false })
  imageName: string;

  @Column()
  @ApiProperty({ example: 30 })
  preparationTime: number;

  @Column()
  @ApiProperty({ example: 45 })
  cookTime: number;

  @Column()
  @ApiProperty({ example: 6 })
  numberPeople: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.recipes)
  @ApiProperty({ type: () => User })
  user: User;

  @ManyToMany(() => Category, (category) => category.recipes)
  @JoinTable({
    name: 'recipes_categories',
    joinColumn: {
      name: 'recipeId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'id',
    },
  })
  @ApiProperty({ type: () => Category, isArray: true })
  categories: Category[];

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  @ApiProperty({ type: () => Ingredient, isArray: true })
  ingredients: Ingredient[];

  @OneToMany(() => Step, (step) => step.recipe, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  @ApiProperty({ type: () => Step, isArray: true })
  steps: Step[];
}
