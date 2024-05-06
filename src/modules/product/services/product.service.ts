// product.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductChangeService } from './product-change.service'; // Import ProductChangeService
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  Paginated,
  paginate,
} from 'nestjs-paginate';

/**
 * Service responsible for managing product-related operations.
 */
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productChangeService: ProductChangeService, // Inject ProductChangeService
  ) {}

  /**
   * Retrieves paginated list of products.
   * @param query Paginate query.
   * @returns Paginated list of products.
   */
  async findAll(query: PaginateQuery): Promise<Paginated<Product>> {
    return paginate(query, this.productRepository, {
      sortableColumns: ['id', 'name', 'price'],
      defaultSortBy: [['id', 'DESC']],
      searchableColumns: ['id', 'name', 'price'],
      select: ['id', 'name', 'price', 'description'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
      },
    });
  }

  /**
   * Finds a product by its ID.
   * @param id Product ID.
   * @returns Product entity.
   */
  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  /**
   * Creates a new product.
   * @param createProductDto Product data.
   * @returns Created product entity.
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price } = createProductDto;
    const product = this.productRepository.create({ name, description, price });
    return await this.productRepository.save(product);
  }

  /**
   * Updates an existing product.
   * @param id Product ID.
   * @param updateProductDto Updated product data.
   * @returns Updated product entity.
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { id },
    });
    if (!existingProduct) {
      throw new Error('Product not found');
    }
    // Update existing product with the data from the DTO
    const changes: Partial<Product> = {};
    for (const key in updateProductDto) {
      if (existingProduct[key] !== updateProductDto[key]) {
        changes[key] = {
          previousValue: existingProduct[key],
          newValue: updateProductDto[key],
        };
      }
    }

    await this.productChangeService.createChanges(existingProduct, changes); // Use ProductChangeService

    Object.assign(existingProduct, updateProductDto);
    return await this.productRepository.save(existingProduct);
  }
}
