import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductChangeService } from '../services/product-change.service';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { ProductChange } from '../entities/product-change.entity';
import { ProductChangeFacadeInterface } from './product-change-facade.interface';

/**
 * Facade class implementing methods defined in ProductChangeFacadeInterface.
 */
@Injectable()
export class ProductChangeFacade implements ProductChangeFacadeInterface {
  constructor(private readonly productChangeService: ProductChangeService) {}

  /**
   * Find product changes by product ID with pagination.
   * @param productId Product ID.
   * @param query PaginateQuery object for pagination options.
   * @returns Promise resolving to a Paginated array of ProductChange entities.
   * @throws NotFoundException if product changes are not found.
   */
  async findByProductId(
    productId: number,
    query: PaginateQuery,
  ): Promise<Paginated<ProductChange>> {
    try {
      return await this.productChangeService.findByProductId(productId, query);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Product changes not found');
    }
  }

  /**
   * Find product changes by product ID and field name.
   * @param productId Product ID.
   * @param fieldName Field name to filter product changes.
   * @returns Promise resolving to an array of ProductChange entities.
   */
  async findByProductIdAndField(
    productId: number,
    fieldName: string,
  ): Promise<ProductChange[]> {
    return this.productChangeService.findByProductIdAndField(
      productId,
      fieldName,
    );
  }
}
