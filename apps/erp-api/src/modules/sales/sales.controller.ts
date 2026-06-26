import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Public } from '@/modules/auth/common/decorators/public.decorator';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Public()
  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Public()
  @Post()
  create(@Body() data: { customer?: string; items: any[]; subtotal: number; tax: number; total: number; status?: string; paymentMethod?: string }) {
    return this.salesService.create(data);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Record<string, any>) {
    return this.salesService.update(id, data);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
