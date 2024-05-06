import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { ProductChange } from '../entities/product-change.entity';

/**
 * Interface defining methods for interacting with product change data.
 */
export interface ProductChangeFacadeInterface {
  /**
   * Find product changes by product ID with pagination.
   * @param productId Product ID.
   * @param query PaginateQuery object for pagination options.
   * @returns Promise resolving to a Paginated array of ProductChange entities.
   */
  findByProductId(
    productId: number,
    query: PaginateQuery,
  ): Promise<Paginated<ProductChange>>;

  /**
   * Find product changes by product ID and field name.
   * @param productId Product ID.
   * @param fieldName Field name to filter product changes.
   * @returns Promise resolving to an array of ProductChange entities.
   */
  findByProductIdAndField(
    productId: number,
    fieldName: string,
  ): Promise<ProductChange[]>;
}
