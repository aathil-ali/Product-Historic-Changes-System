// product-change.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductChange } from '../entities/product-change.entity';
import { UserProvider } from '../../user/providers/user.provider';
import { ProductChangeDto } from '../dto/product-change.dto';

import {
  PaginateQuery,
  Paginated,
  FilterOperator,
  paginate,
  Paginate,
  PaginateConfig,
  FilterSuffix,
} from 'nestjs-paginate';

@Injectable()
export class ProductChangeService {
  UserProvider: UserProvider;
  constructor(
    @InjectRepository(ProductChange)
    private readonly productChangeRepository: Repository<ProductChange>,
    private readonly userProvider: UserProvider, // Inject UserProvider
  ) {}
  async createChanges(
    product: Product,
    changes: Partial<Product>,
  ): Promise<void> {
    const user = this.userProvider.getUser(); // Access the user information from the request;

    const changeEntities = Object.keys(changes).map((fieldName) => {
      const change = new ProductChange();
      change.fieldName = fieldName;
      change.previousValue = changes[fieldName].previousValue;
      change.newValue = changes[fieldName].newValue;
      change.product = product;
      change.user = user;
      return change;
    });

    await this.productChangeRepository.save(changeEntities);
  }
  async findByProductId(
    productId: number,
    query: PaginateQuery,
  ): Promise<Paginated<ProductChange>> {
    const productChangesQueryBuilder = this.productChangeRepository
      .createQueryBuilder('change')
      .leftJoinAndSelect('change.user', 'user')
      .select([
        'change.id',
        'change.fieldName',
        'change.previousValue',
        'change.newValue',
        'change.timestamp',
        'user.username',
        'user.id',
        'user.email',
      ])
      .where('change.product = :productId', { productId });
    const config: PaginateConfig<ProductChange> = {
      sortableColumns: ['fieldName'],
    };

    const result = await paginate<ProductChange>(
      query,
      productChangesQueryBuilder,
      config,
    );

    return result;
  }
  async findByProductIdAndField(
    productId: number,
    fieldName: string,
  ): Promise<ProductChange[]> {
    const productChanges = await this.productChangeRepository
      .createQueryBuilder('change')
      .leftJoinAndSelect('change.user', 'user') // Join with the User entity
      .where('change.product = :productId', { productId })
      .where('change.fieldName = :fieldName', { fieldName })
      .select([
        'change.id',
        'change.fieldName',
        'change.previousValue',
        'change.newValue',
        'change.timestamp',
        'user.username',
        'user.id',
        'user.email',
      ])
      .getMany();

    if (!productChanges || productChanges.length === 0) {
      throw new NotFoundException('Product change history not found');
    }

    return productChanges;
  }
}
