import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsDateString, ValidateNested, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class PurchaseItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitCost: number;

  @IsNumber()
  @Min(0)
  subtotal: number;
}

export class CreatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  supplier: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items: PurchaseItemDto[];

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

  @IsDateString()
  @IsOptional()
  expectedDate?: string;
}

export class UpdatePurchaseDto {
  @IsString()
  @IsOptional()
  supplier?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemDto)
  items?: PurchaseItemDto[];

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

  @IsDateString()
  @IsOptional()
  expectedDate?: string;
}
