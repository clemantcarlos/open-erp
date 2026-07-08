import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AccountingService } from './accounting.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from './dto/journal-entry.dto';
import { Roles } from '../auth/common/decorators/roles.decorator';

@ApiTags('accounting')
@ApiBearerAuth()
@Controller('accounting')
export class AccountingController {
  constructor(private readonly accountingService: AccountingService) {}

  @Get('accounts')
  @ApiOperation({ summary: 'List all accounts with optional filters' })
  findAccounts(@Query('page') page?: string, @Query('limit') limit?: string, @Query('type') type?: string, @Query('search') search?: string) {
    return this.accountingService.findAccounts({ page: page ? +page : 1, limit: limit ? +limit : 20, type, search });
  }

  @Post('accounts')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new account' })
  createAccount(@Body() dto: CreateAccountDto) {
    return this.accountingService.createAccount(dto);
  }

  @Get('accounts/:id')
  @ApiOperation({ summary: 'Get an account by ID' })
  findOneAccount(@Param('id') id: string) {
    return this.accountingService.findOneAccount(id);
  }

  @Patch('accounts/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update an account' })
  updateAccount(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    return this.accountingService.updateAccount(id, dto);
  }

  @Roles('admin')
  @Delete('accounts/:id')
  @ApiOperation({ summary: 'Delete an account' })
  removeAccount(@Param('id') id: string) {
    return this.accountingService.removeAccount(id);
  }

  @Get('journal')
  @ApiOperation({ summary: 'List journal entries with optional filters' })
  findJournalEntries(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string, @Query('search') search?: string) {
    return this.accountingService.findJournalEntries({ page: page ? +page : 1, limit: limit ? +limit : 20, status, search });
  }

  @Post('journal')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new journal entry' })
  createJournalEntry(@Body() dto: CreateJournalEntryDto) {
    return this.accountingService.createJournalEntry(dto);
  }

  @Get('journal/:id')
  @ApiOperation({ summary: 'Get a journal entry by ID' })
  findOneJournalEntry(@Param('id') id: string) {
    return this.accountingService.findOneJournalEntry(id);
  }

  @Patch('journal/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a journal entry' })
  updateJournalEntry(@Param('id') id: string, @Body() dto: UpdateJournalEntryDto) {
    return this.accountingService.updateJournalEntry(id, dto);
  }

  @Roles('admin')
  @Delete('journal/:id')
  @ApiOperation({ summary: 'Delete a journal entry' })
  removeJournalEntry(@Param('id') id: string) {
    return this.accountingService.removeJournalEntry(id);
  }
}
