import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto, UpdatePurchaseDto } from './dto/purchase.dto';
import { Roles } from '../auth/common/decorators/roles.decorator';

@ApiTags('purchases')
@ApiBearerAuth()
@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Get()
  @ApiOperation({ summary: 'List all purchases with optional filters' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string, @Query('supplier') supplier?: string) {
    return this.purchasesService.findAll({ page: page ? +page : 1, limit: limit ? +limit : 20, status, supplier });
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new purchase' })
  create(@Body() dto: CreatePurchaseDto) {
    return this.purchasesService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a purchase by ID' })
  findOne(@Param('id') id: string) {
    return this.purchasesService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a purchase' })
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseDto) {
    return this.purchasesService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a purchase' })
  remove(@Param('id') id: string) {
    return this.purchasesService.remove(id);
  }
}
