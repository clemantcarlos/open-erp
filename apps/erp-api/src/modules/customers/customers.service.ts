import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany({ orderBy: { name: 'asc' } });
  }

  create(data: { name: string; email?: string; phone?: string; segment?: string; address?: string; birthDate?: string; notes?: string }) {
    return this.prisma.customer.create({
      data: {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.customer.findUnique({ where: { id } });
  }

  update(id: string, data: Record<string, any>) {
    if (data.birthDate) {
      data.birthDate = new Date(data.birthDate);
    }
    return this.prisma.customer.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.customer.delete({ where: { id } });
  }
}
