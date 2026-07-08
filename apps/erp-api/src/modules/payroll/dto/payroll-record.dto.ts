import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class CreatePayrollRecordDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsNumber()
  @Min(0)
  baseSalary: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  bonuses?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  deductions?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tax?: number;

  @IsNumber()
  @Min(0)
  netPay: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  paidDate?: string;
}

export class UpdatePayrollRecordDto {
  @IsString()
  @IsOptional()
  period?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  baseSalary?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  bonuses?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  deductions?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  tax?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  netPay?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  paidDate?: string;
}
