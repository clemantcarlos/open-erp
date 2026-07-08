import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ManufacturingService } from './manufacturing.service';
import { CreateProcessStepDto, UpdateProcessStepDto } from './dto/process-step.dto';
import { CreateCompositeProductDto, UpdateCompositeProductDto } from './dto/composite-product.dto';
import { CreateProductionOrderDto, UpdateProductionOrderDto } from './dto/production-order.dto';
import { Roles } from '../auth/common/decorators/roles.decorator';

@ApiTags('manufacturing')
@ApiBearerAuth()
@Controller('manufacturing')
export class ManufacturingController {
  constructor(private readonly manufacturingService: ManufacturingService) {}

  @Get('process-steps')
  @ApiOperation({ summary: 'List all process steps' })
  findProcessSteps(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.manufacturingService.findProcessSteps({ page: page ? +page : 1, limit: limit ? +limit : 50 });
  }

  @Post('process-steps')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new process step' })
  createProcessStep(@Body() dto: CreateProcessStepDto) {
    return this.manufacturingService.createProcessStep(dto);
  }

  @Get('process-steps/:id')
  @ApiOperation({ summary: 'Get a process step by ID' })
  findOneProcessStep(@Param('id') id: string) {
    return this.manufacturingService.findOneProcessStep(id);
  }

  @Patch('process-steps/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a process step' })
  updateProcessStep(@Param('id') id: string, @Body() dto: UpdateProcessStepDto) {
    return this.manufacturingService.updateProcessStep(id, dto);
  }

  @Roles('admin')
  @Delete('process-steps/:id')
  @ApiOperation({ summary: 'Delete a process step' })
  removeProcessStep(@Param('id') id: string) {
    return this.manufacturingService.removeProcessStep(id);
  }

  @Get('composite-products')
  @ApiOperation({ summary: 'List composite products with optional filters' })
  findCompositeProducts(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string, @Query('category') category?: string) {
    return this.manufacturingService.findCompositeProducts({ page: page ? +page : 1, limit: limit ? +limit : 50, search, category });
  }

  @Post('composite-products')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new composite product' })
  createCompositeProduct(@Body() dto: CreateCompositeProductDto) {
    return this.manufacturingService.createCompositeProduct(dto);
  }

  @Get('composite-products/:id')
  @ApiOperation({ summary: 'Get a composite product by ID' })
  findOneCompositeProduct(@Param('id') id: string) {
    return this.manufacturingService.findOneCompositeProduct(id);
  }

  @Patch('composite-products/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a composite product' })
  updateCompositeProduct(@Param('id') id: string, @Body() dto: UpdateCompositeProductDto) {
    return this.manufacturingService.updateCompositeProduct(id, dto);
  }

  @Roles('admin')
  @Delete('composite-products/:id')
  @ApiOperation({ summary: 'Delete a composite product' })
  removeCompositeProduct(@Param('id') id: string) {
    return this.manufacturingService.removeCompositeProduct(id);
  }

  @Get('orders')
  @ApiOperation({ summary: 'List production orders with optional filters' })
  findProductionOrders(@Query('page') page?: string, @Query('limit') limit?: string, @Query('status') status?: string, @Query('compositeProductId') compositeProductId?: string) {
    return this.manufacturingService.findProductionOrders({ page: page ? +page : 1, limit: limit ? +limit : 50, status, compositeProductId });
  }

  @Post('orders')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new production order' })
  createProductionOrder(@Body() dto: CreateProductionOrderDto) {
    return this.manufacturingService.createProductionOrder(dto);
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get a production order by ID' })
  findOneProductionOrder(@Param('id') id: string) {
    return this.manufacturingService.findOneProductionOrder(id);
  }

  @Patch('orders/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a production order' })
  updateProductionOrder(@Param('id') id: string, @Body() dto: UpdateProductionOrderDto) {
    return this.manufacturingService.updateProductionOrder(id, dto);
  }

  @Roles('admin')
  @Delete('orders/:id')
  @ApiOperation({ summary: 'Delete a production order' })
  removeProductionOrder(@Param('id') id: string) {
    return this.manufacturingService.removeProductionOrder(id);
  }
}
