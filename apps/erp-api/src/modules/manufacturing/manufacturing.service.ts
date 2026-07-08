import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCompositeProductDto } from './dto/composite-product.dto';
import { CreateProductionOrderDto } from './dto/production-order.dto';

@Injectable()
export class ManufacturingService {
  constructor(private readonly prisma: PrismaService) {}

  // Process Steps
  async findProcessSteps(params?: { page?: number; limit?: number }) {
    const { page = 1, limit = 50 } = params || {};
    const [data, total] = await Promise.all([
      this.prisma.processStep.findMany({ orderBy: { order: 'asc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.processStep.count(),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneProcessStep(id: string) {
    const step = await this.prisma.processStep.findUnique({ where: { id } });
    if (!step) throw new NotFoundException(`Process step ${id} not found`);
    return step;
  }

  createProcessStep(data: { processId: string; processName: string; description: string; order: number }) {
    return this.prisma.processStep.create({ data });
  }

  async updateProcessStep(id: string, data: Record<string, any>) {
    await this.findOneProcessStep(id);
    return this.prisma.processStep.update({ where: { id }, data });
  }

  async removeProcessStep(id: string) {
    await this.findOneProcessStep(id);
    return this.prisma.processStep.delete({ where: { id } });
  }

  // Composite Products
  async findCompositeProducts(params?: { page?: number; limit?: number; search?: string; category?: string }) {
    const { page = 1, limit = 50, search, category } = params || {};
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }];
    if (category) where.category = category;
    const [data, total] = await Promise.all([
      this.prisma.compositeProduct.findMany({ where, orderBy: { name: 'asc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.compositeProduct.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneCompositeProduct(id: string) {
    const product = await this.prisma.compositeProduct.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Composite product ${id} not found`);
    return product;
  }

  createCompositeProduct(data: CreateCompositeProductDto) {
    return this.prisma.compositeProduct.create({
      data: { ...data, bom: data.bom as any, routing: data.routing as any },
    });
  }

  async updateCompositeProduct(id: string, data: Record<string, any>) {
    await this.findOneCompositeProduct(id);
    return this.prisma.compositeProduct.update({ where: { id }, data });
  }

  async removeCompositeProduct(id: string) {
    await this.findOneCompositeProduct(id);
    return this.prisma.compositeProduct.delete({ where: { id } });
  }

  // Production Orders
  async findProductionOrders(params?: { page?: number; limit?: number; status?: string; compositeProductId?: string }) {
    const { page = 1, limit = 50, status, compositeProductId } = params || {};
    const where: any = {};
    if (status) where.status = status;
    if (compositeProductId) where.compositeProductId = compositeProductId;
    const [data, total] = await Promise.all([
      this.prisma.productionOrder.findMany({ where, orderBy: { scheduledDate: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.productionOrder.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneProductionOrder(id: string) {
    const order = await this.prisma.productionOrder.findUnique({ where: { id } });
    if (!order) throw new NotFoundException(`Production order ${id} not found`);
    return order;
  }

  createProductionOrder(data: CreateProductionOrderDto) {
    return this.prisma.productionOrder.create({
      data: { ...data, scheduledDate: new Date(data.scheduledDate) },
    });
  }

  async updateProductionOrder(id: string, data: Record<string, any>) {
    await this.findOneProductionOrder(id);
    if (data.scheduledDate) data.scheduledDate = new Date(data.scheduledDate);
    if (data.completedDate) data.completedDate = new Date(data.completedDate);
    return this.prisma.productionOrder.update({ where: { id }, data });
  }

  async removeProductionOrder(id: string) {
    await this.findOneProductionOrder(id);
    return this.prisma.productionOrder.delete({ where: { id } });
  }
}
