import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateProcessStepDto {
  @IsString()
  @IsNotEmpty()
  processId: string;

  @IsString()
  @IsNotEmpty()
  processName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  order: number;
}

export class UpdateProcessStepDto {
  @IsString()
  @IsOptional()
  processName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  order?: number;
}
