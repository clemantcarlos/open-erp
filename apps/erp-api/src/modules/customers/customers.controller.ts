import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Public } from '@/modules/auth/common/decorators/public.decorator';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Public()
  @Post()
  create(@Body() data: { name: string; email?: string; phone?: string; segment?: string; address?: string; birthDate?: string; notes?: string }) {
    return this.customersService.create(data);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Record<string, any>) {
    return this.customersService.update(id, data);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
