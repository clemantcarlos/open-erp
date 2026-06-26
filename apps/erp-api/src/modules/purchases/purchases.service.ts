import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.purchase.findMany({ orderBy: { date: 'desc' } });
  }

  create(data: { supplier: string; items: any[]; subtotal: number; tax: number; total: number; status?: string; expectedDate?: string }) {
    return this.prisma.purchase.create({
      data: {
        ...data,
        expectedDate: data.expectedDate ? new Date(data.expectedDate) : null,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.purchase.findUnique({ where: { id } });
  }

  update(id: string, data: Record<string, any>) {
    const updateData = { ...data };
    if (updateData.expectedDate) {
      updateData.expectedDate = new Date(updateData.expectedDate);
    }
    return this.prisma.purchase.update({ where: { id }, data: updateData });
  }

  remove(id: string) {
    return this.prisma.purchase.delete({ where: { id } });
  }
}
