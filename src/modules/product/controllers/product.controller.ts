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
import { ListProductDto } from '../dto/list-product.dto';
import { ProductChangeInterceptor } from '../interceptors/product-change.interceptor';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Product>> {
    const products = await this.productService.findAll(query);
    return products;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetProductDto> {
    const product = await this.productService.findOne(+id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.productToDto(product);
  }

  @Post()
  async create(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ): Promise<GetProductDto> {
    const product = await this.productService.create(createProductDto);
    return this.productToDto(product);
  }

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

  private productToDto(product: Product): GetProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
    };
  }
}
