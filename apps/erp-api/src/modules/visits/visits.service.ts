import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.visit.findMany({
      include: { customer: true },
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.visit.findUnique({ where: { id }, include: { customer: true } });
  }

  create(data: { customerId: string; date: string; time: string; type?: string; effectiveness?: string; purpose?: string; notes?: string; duration?: number; nextVisit?: string }) {
    return this.prisma.visit.create({
      data: {
        ...data,
        date: new Date(data.date),
        nextVisit: data.nextVisit ? new Date(data.nextVisit) : null,
      },
      include: { customer: true },
    });
  }

  update(id: string, data: Record<string, any>) {
    if (data.date) data.date = new Date(data.date);
    if (data.nextVisit) data.nextVisit = new Date(data.nextVisit);
    return this.prisma.visit.update({ where: { id }, data, include: { customer: true } });
  }

  remove(id: string) {
    return this.prisma.visit.delete({ where: { id } });
  }
}
