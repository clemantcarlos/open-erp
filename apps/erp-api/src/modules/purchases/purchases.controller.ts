import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { Public } from '@/modules/auth/common/decorators/public.decorator';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Public()
  @Get()
  findAll() {
    return this.purchasesService.findAll();
  }

  @Public()
  @Post()
  create(@Body() data: { supplier: string; items: any[]; subtotal: number; tax: number; total: number; status?: string; expectedDate?: string }) {
    return this.purchasesService.create(data);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Record<string, any>) {
    return this.purchasesService.update(id, data);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(id);
  }
}
