import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Param,
  Put,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { GetProductDto } from '../dto/get-product.dto';
import { ProductChangeInterceptor } from '../interceptors/product-change.interceptor';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';

/**
 * Controller responsible for handling product-related endpoints.
 */
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Retrieve all products with pagination support.
   * @param query PaginateQuery object for pagination options.
   * @returns Promise resolving to a Paginated array of Product entities.
   */
  @Get()
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    const products = await this.productService.findAll(query);
    return products;
  }

  /**
   * Retrieve a specific product by ID.
   * @param id Product ID.
   * @returns Promise resolving to a GetProductDto object representing the requested product.
   * @throws NotFoundException if the product with the given ID is not found.
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetProductDto> {
    const product = await this.productService.findOne(+id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productToDto(product);
  }

  /**
   * Create a new product.
   * @param createProductDto Data for creating the product.
   * @returns Promise resolving to a GetProductDto object representing the created product.
   */
  @Post()
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ): Promise<GetProductDto> {
    const product = await this.productService.create(createProductDto);
    return this.productToDto(product);
  }

  /**
   * Update an existing product.
   * @param id Product ID.
   * @param updateProductDto Data for updating the product.
   * @returns Promise resolving to a GetProductDto object representing the updated product.
   * @throws NotFoundException if the product with the given ID is not found.
   */
  @Put(':id')
  @UseInterceptors(ProductChangeInterceptor) // Apply the interceptor to the update method
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ): Promise<GetProductDto> {
    const product = await this.productService.update(+id, updateProductDto);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productToDto(product);
  }

  /**
   * Maps a Product entity to a GetProductDto object.
   * @param product Product entity to map.
   * @returns GetProductDto representing the mapped product.
   */
  private productToDto(product: Product): GetProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
    };
  }
}