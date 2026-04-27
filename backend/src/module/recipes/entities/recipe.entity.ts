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

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageName: string;

  @Column()
  preparationTime: number;

  @Column()
  cookTime: number;

  @Column()
  numberPeople: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.recipes)
  user: User;

  @ManyToMany(() => Category, (category) => category.recipes)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe)
  ingredients: Ingredient[];

  @OneToMany(() => Step, (step) => step.recipe)
  steps: Step[];
}
