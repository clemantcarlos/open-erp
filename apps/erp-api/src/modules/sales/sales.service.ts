import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.sale.findMany({ orderBy: { date: 'desc' } });
  }

  findOne(id: string) {
    return this.prisma.sale.findUnique({ where: { id } });
  }

  create(data: { customer?: string; items: any[]; subtotal: number; tax: number; total: number; status?: string; paymentMethod?: string }) {
    return this.prisma.sale.create({ data });
  }

  update(id: string, data: Record<string, any>) {
    if (data.date) data.date = new Date(data.date);
    return this.prisma.sale.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.sale.delete({ where: { id } });
  }
}
