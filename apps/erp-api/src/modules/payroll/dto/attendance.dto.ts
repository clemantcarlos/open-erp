import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsString()
  @IsNotEmpty()
  employeeName: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  clockIn?: string;

  @IsString()
  @IsOptional()
  clockOut?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  hoursWorked?: number;

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateAttendanceDto {
  @IsString()
  @IsOptional()
  clockIn?: string;

  @IsString()
  @IsOptional()
  clockOut?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  hoursWorked?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
