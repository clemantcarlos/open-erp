import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BomItemDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsNotEmpty() name: string;
  @IsNumber() @Min(0) quantity: number;
  @IsNumber() @Min(0) unitCost: number;
}

export class RoutingItemDto {
  @IsString() @IsNotEmpty() processStepId: string;
  @IsString() @IsNotEmpty() processName: string;
  @IsNumber() @Min(0) timeMinutes: number;
  @IsNumber() @Min(0) cost: number;
}

export class CreateCompositeProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(0)
  salePrice: number;

  @IsString()
  @IsOptional()
  emoji?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BomItemDto)
  bom: BomItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutingItemDto)
  routing: RoutingItemDto[];
}

export class UpdateCompositeProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  salePrice?: number;

  @IsString()
  @IsOptional()
  emoji?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BomItemDto)
  bom?: BomItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RoutingItemDto)
  routing?: RoutingItemDto[];
}
