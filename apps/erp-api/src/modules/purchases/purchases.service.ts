import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePurchaseDto, UpdatePurchaseDto } from './dto/purchase.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: { page?: number; limit?: number; status?: string; supplier?: string }) {
    const { page = 1, limit = 20, status, supplier } = params || {};
    const where: Prisma.PurchaseWhereInput = {};
    if (status) where.status = status;
    if (supplier) where.supplier = { contains: supplier, mode: 'insensitive' };
    
    const [data, total] = await Promise.all([
      this.prisma.purchase.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.purchase.count({ where }),
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

  async findOne(id: string) {
    const purchase = await this.prisma.purchase.findUnique({ where: { id } });
    if (!purchase) throw new NotFoundException(`Purchase ${id} not found`);
    return purchase;
  }

  create(data: CreatePurchaseDto) {
    return this.prisma.purchase.create({
      data: {
        ...data,
        items: data.items as unknown as Prisma.InputJsonValue,
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
      },
    });
  }

  async update(id: string, data: UpdatePurchaseDto) {
    await this.findOne(id);
    const { items, ...rest } = data;
    const updateData: Prisma.PurchaseUpdateInput = { ...rest };
    if (data.expectedDate) {
      updateData.expectedDate = new Date(data.expectedDate);
    }
    if (items) updateData.items = items as unknown as Prisma.InputJsonValue;
    return this.prisma.purchase.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.purchase.delete({ where: { id } });
  }
}
