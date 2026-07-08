import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateSaleDto, UpdateSaleDto } from './dto/sale.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: { page?: number; limit?: number; status?: string; from?: string; to?: string }) {
    const { page = 1, limit = 20, status, from, to } = params || {};
    const where: Prisma.SaleWhereInput = {};
    if (status) where.status = status;
    if (from || to) {
      where.date = {};
      if (from) where.date.gte = new Date(from);
      if (to) where.date.lte = new Date(to);
    }
    
    const [data, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.sale.count({ where }),
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
    const sale = await this.prisma.sale.findUnique({ where: { id } });
    if (!sale) throw new NotFoundException(`Sale ${id} not found`);
    return sale;
  }

  async create(data: CreateSaleDto) {
    return this.prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        if (!item.productId) continue;
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
        if (product.quantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${product.name}: has ${product.quantity}, needs ${item.quantity}`);
        }
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }
      return tx.sale.create({ data: { ...data, items: data.items as unknown as Prisma.InputJsonValue } });
    });
  }

  async update(id: string, data: UpdateSaleDto) {
    await this.findOne(id);
    const { items, ...rest } = data;
    const updateData: Prisma.SaleUpdateInput = { ...rest };
    if (data.date) updateData.date = new Date(data.date);
    if (items) updateData.items = items as unknown as Prisma.InputJsonValue;
    return this.prisma.sale.update({ where: { id }, data: updateData });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.sale.delete({ where: { id } });
  }
}
