import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { Public } from '@/modules/auth/common/decorators/public.decorator';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Public()
  @Get()
  findAll() {
    return this.visitsService.findAll();
  }

  @Public()
  @Post()
  create(@Body() data: { customerId: string; date: string; time: string; type?: string; effectiveness?: string; purpose?: string; notes?: string; duration?: number; nextVisit?: string }) {
    return this.visitsService.create(data);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitsService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Record<string, any>) {
    return this.visitsService.update(id, data);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitsService.remove(id);
  }
}
