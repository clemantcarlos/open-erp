import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto } from './dto/sale.dto';
import { Roles } from '../auth/common/decorators/roles.decorator';

@ApiTags('sales')
@ApiBearerAuth()
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @ApiOperation({ summary: 'List all sales with optional filters' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string, @Query('from') from?: string, @Query('to') to?: string) {
    return this.salesService.findAll({ page: page ? +page : 1, limit: limit ? +limit : 20, status, from, to });
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new sale' })
  create(@Body() dto: CreateSaleDto) {
    return this.salesService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by ID' })
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a sale' })
  update(@Param('id') id: string, @Body() dto: UpdateSaleDto) {
    return this.salesService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale' })
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
