// src/modules/product/entities/product-change.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class ProductChange {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fieldName: string;

  @Column()
  previousValue: string;

  @Column()
  newValue: string;

  @ManyToOne(() => Product, (product) => product.changes)
  product: Product;

  @ManyToOne(() => User) // Establishing Many-to-One relationship with User
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
