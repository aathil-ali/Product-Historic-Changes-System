// product-change.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';
import { ProductChange } from '../entities/product-change.entity';
import { ProductChangeFilterDto } from '../dto/product-change-filter.dto';
import { ProductChangeFacade } from '../facades/product-change.facade';

@Controller('products/:productId/history')
export class ProductChangeController {
  constructor(private readonly productChangeFacade: ProductChangeFacade) {}

  @ApiOperation({
    summary: 'Retrieve historical changes for a specific product',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the historical changes for the specified product',
  })
  @Get()
  async findByProductId(
    @Paginate() query: PaginateQuery,
    @Param('productId') productId: number,
  ): Promise<Paginated<ProductChange>> {
    return await this.productChangeFacade.findByProductId(productId, query);
  }

  @ApiOperation({
    summary: 'Retrieve historical changes for a specific product and field',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the historical changes for the specified product and field',
  })
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
