import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, ValidateNested, Min, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class SaleItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsNumber()
  @Min(0)
  subtotal: number;
}

export class CreateSaleDto {
  @IsString()
  @IsOptional()
  customer?: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @Min(0)
  tax: number;

  @IsNumber()
  @Min(0)
  total: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

export class UpdateSaleDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  customer?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items?: SaleItemDto[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  subtotal?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tax?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  total?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}
