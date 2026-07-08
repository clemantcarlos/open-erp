import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateProductionOrderDto {
  @IsString()
  @IsNotEmpty()
  compositeProductId: string;

  @IsString()
  @IsNotEmpty()
  compositeProductName: string;

  @IsNumber()
  @Min(1)
  quantityPlanned: number;

  @IsDateString()
  scheduledDate: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateProductionOrderDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  quantityPlanned?: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  completedDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
