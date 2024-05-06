import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductChange } from './product-change.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;
  @OneToMany(() => ProductChange, (productChange) => productChange.product)
  changes: ProductChange[];
}
