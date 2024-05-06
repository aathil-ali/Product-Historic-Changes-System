import { Controller, Get, Param, Query } from '@nestjs/common';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { ProductChange } from '../entities/product-change.entity';
import { ProductChangeFilterDto } from '../dto/product-change-filter.dto';
import { ProductChangeFacade } from '../facades/product-change.facade';

/**
 * Controller responsible for handling product change related endpoints.
 */
@Controller('products/:productId/history')
export class ProductChangeController {
  constructor(private readonly productChangeFacade: ProductChangeFacade) {}

  /**
   * Retrieve historical changes for a specific product.
   * @param query PaginateQuery object for pagination options.
   * @param productId Product ID.
   * @returns Promise resolving to a Paginated array of ProductChange entities.
   */
  @Get()
  async findByProductId(
    @Paginate() query: PaginateQuery,
    @Param('productId') productId: number,
  ): Promise<Paginated<ProductChange>> {
    return await this.productChangeFacade.findByProductId(productId, query);
  }

  /**
   * Retrieve historical changes for a specific product and field.
   * @param productId Product ID.
   * @param filterDto ProductChangeFilterDto object containing filter options.
   * @returns Promise resolving to an array of ProductChange entities.
   */
  @Get('/filter')
  async findByProductIdAndField(
    @Param('productId') productId: number,
    @Query() filterDto: ProductChangeFilterDto,
  ): Promise<ProductChange[]> {
    return this.productChangeFacade.findByProductIdAndField(
      productId,
      filterDto.fieldName,
    );
  }
}
