// product-change-facade.interface.ts
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { ProductChange } from '../entities/product-change.entity';

export interface ProductChangeFacadeInterface {
  findByProductId(
    productId: number,
    query: PaginateQuery,
  ): Promise<Paginated<ProductChange>>;
  findByProductIdAndField(
    productId: number,
    fieldName: string,
  ): Promise<ProductChange[]>;
}
