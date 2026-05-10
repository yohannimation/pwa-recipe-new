import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'Desserts' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ example: null, required: false })
  idParent: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'idParent' })
  @ApiProperty({ type: () => Category, required: false })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  @ApiProperty({ type: () => Category, isArray: true })
  children: Category[];

  @ManyToMany(() => Recipe, (recipe) => recipe.categories)
  @ApiProperty({ type: () => Recipe, isArray: true })
  recipes: Recipe[];
}
