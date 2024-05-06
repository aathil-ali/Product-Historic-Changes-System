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

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly productChangeService: ProductChangeService, // Inject ProductChangeService
  ) {}

  // async findAll(): Promise<Product[]> {
  //   return await this.productRepository.find();
  // }
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

  async findOne(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price } = createProductDto;
    const product = this.productRepository.create({ name, description, price });
    return await this.productRepository.save(product);
  }

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
