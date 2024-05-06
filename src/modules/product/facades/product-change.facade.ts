// product-change.facade.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductChangeService } from '../services/product-change.service';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { ProductChange } from '../entities/product-change.entity';
import { ProductChangeFacadeInterface } from './product-change-facade.interface';

@Injectable()
export class ProductChangeFacade implements ProductChangeFacadeInterface {
  constructor(private readonly productChangeService: ProductChangeService) {}

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
