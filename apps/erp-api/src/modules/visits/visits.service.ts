import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateVisitDto } from './dto/visit.dto';

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: { page?: number; limit?: number; customerId?: string; type?: string }) {
    const { page = 1, limit = 50, customerId, type } = params || {};
    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (type) where.type = type;
    const [data, total] = await Promise.all([
      this.prisma.visit.findMany({ where, include: { customer: true }, orderBy: { date: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.visit.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const visit = await this.prisma.visit.findUnique({ where: { id }, include: { customer: true } });
    if (!visit) throw new NotFoundException(`Visit ${id} not found`);
    return visit;
  }

  create(data: CreateVisitDto) {
    return this.prisma.visit.create({
      data: {
        ...data,
        date: new Date(data.date),
        nextVisit: data.nextVisit ? new Date(data.nextVisit) : null,
      },
      include: { customer: true },
    });
  }

  async update(id: string, data: Record<string, any>) {
    await this.findOne(id);
    if (data.date) data.date = new Date(data.date);
    if (data.nextVisit) data.nextVisit = new Date(data.nextVisit);
    return this.prisma.visit.update({ where: { id }, data, include: { customer: true } });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.visit.delete({ where: { id } });
  }
}
