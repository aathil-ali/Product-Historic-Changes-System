// get-product.dto.ts
import { IsNumber, IsString } from 'class-validator';

export class GetProductDto {
  @IsNumber()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;
}
