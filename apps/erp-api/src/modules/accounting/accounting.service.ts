import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateAccountDto, UpdateAccountDto } from './dto/account.dto';
import { CreateJournalEntryDto, UpdateJournalEntryDto } from './dto/journal-entry.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountingService {
  constructor(private readonly prisma: PrismaService) {}

  // Accounts
  async findAccounts(params?: { page?: number; limit?: number; type?: string; search?: string }) {
    const { page = 1, limit = 20, type, search } = params || {};
    const where: Prisma.AccountWhereInput = {};
    if (type) where.type = type;
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { code: { contains: search, mode: 'insensitive' } }];
    
    const [data, total] = await Promise.all([
      this.prisma.account.findMany({ where, orderBy: { code: 'asc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.account.count({ where }),
    ]);
    
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneAccount(id: string) {
    const account = await this.prisma.account.findUnique({ where: { id } });
    if (!account) throw new NotFoundException(`Account ${id} not found`);
    return account;
  }

  createAccount(data: CreateAccountDto) {
    return this.prisma.account.create({ data });
  }

  async updateAccount(id: string, data: UpdateAccountDto) {
    await this.findOneAccount(id);
    return this.prisma.account.update({ where: { id }, data });
  }

  async removeAccount(id: string) {
    await this.findOneAccount(id);
    return this.prisma.account.delete({ where: { id } });
  }

  // Journal Entries
  async findJournalEntries(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const { page = 1, limit = 20, status, search } = params || {};
    const where: Prisma.JournalEntryWhereInput = {};
    if (status) where.status = status;
    if (search) where.OR = [{ description: { contains: search, mode: 'insensitive' } }, { reference: { contains: search, mode: 'insensitive' } }];
    
    const [data, total] = await Promise.all([
      this.prisma.journalEntry.findMany({ where, orderBy: { date: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.journalEntry.count({ where }),
    ]);
    
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneJournalEntry(id: string) {
    const entry = await this.prisma.journalEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException(`Journal entry ${id} not found`);
    return entry;
  }

  async createJournalEntry(data: CreateJournalEntryDto) {
    // Validate balanced entry
    const totalDebit = data.lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
    const totalCredit = data.lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(`Journal entry not balanced: debit ${totalDebit} ≠ credit ${totalCredit}`);
    }
    return this.prisma.journalEntry.create({
      data: { date: new Date(data.date), description: data.description, reference: data.reference, lines: data.lines as unknown as Prisma.InputJsonValue, status: data.status || 'draft' },
    });
  }

  async updateJournalEntry(id: string, data: UpdateJournalEntryDto) {
    await this.findOneJournalEntry(id);
    const { lines, ...rest } = data;
    const updateData: Prisma.JournalEntryUpdateInput = { ...rest };
    if (data.date) updateData.date = new Date(data.date);
    if (lines) updateData.lines = lines as unknown as Prisma.InputJsonValue;
    return this.prisma.journalEntry.update({ where: { id }, data: updateData });
  }

  async removeJournalEntry(id: string) {
    await this.findOneJournalEntry(id);
    return this.prisma.journalEntry.delete({ where: { id } });
  }
}
