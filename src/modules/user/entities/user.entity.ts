// src/user/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductChange } from '../../product/entities/product-change.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  // Establish one-to-many relationship with ProductChange entity
  @OneToMany(() => ProductChange, (productChange) => productChange.user)
  productChanges: ProductChange[];
}
