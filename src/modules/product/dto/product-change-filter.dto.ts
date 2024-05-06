// src/modules/product/dto/product-change-filter.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ProductChangeFilterDto {
  @ApiProperty({ description: 'Product ID' })
  @IsNotEmpty()
  @IsInt()
  readonly productId: number;

  @ApiProperty({ description: 'Field name' })
  @IsNotEmpty()
  @IsString()
  readonly fieldName: string;
}
