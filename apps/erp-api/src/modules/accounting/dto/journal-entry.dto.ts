import { IsString, IsNotEmpty, IsOptional, IsArray, IsDateString, ValidateNested, Min, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class JournalEntryLineDto {
  @IsUUID()
  accountId: string;

  @IsNumber()
  @Min(0)
  debit: number;

  @IsNumber()
  @Min(0)
  credit: number;
}

export class CreateJournalEntryDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  lines: JournalEntryLineDto[];

  @IsString()
  @IsOptional()
  status?: string;
}

export class UpdateJournalEntryDto {
  @IsDateString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => JournalEntryLineDto)
  lines?: JournalEntryLineDto[];

  @IsString()
  @IsOptional()
  status?: string;
}
