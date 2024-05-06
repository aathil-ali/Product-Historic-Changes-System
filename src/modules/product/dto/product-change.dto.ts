import { Product } from '../entities/product.entity';

export class ProductChangeDto {
  fieldName: string;
  previousValue: string | number;
  newValue: string | number;
  timestamp: Date;
  changedBy: string;
  data?: any;
  meta?: any;
  links?: any;
}
