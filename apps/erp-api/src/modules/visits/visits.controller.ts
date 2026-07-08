import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VisitsService } from './visits.service';
import { CreateVisitDto, UpdateVisitDto } from './dto/visit.dto';
import { Roles } from '../auth/common/decorators/roles.decorator';

@ApiTags('visits')
@ApiBearerAuth()
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Get()
  @ApiOperation({ summary: 'List all visits with optional filters' })
  findAll(@Query('page') page?: string, @Query('limit') limit?: string, @Query('customerId') customerId?: string, @Query('type') type?: string) {
    return this.visitsService.findAll({ page: page ? +page : 1, limit: limit ? +limit : 50, customerId, type });
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new visit' })
  create(@Body() dto: CreateVisitDto) {
    return this.visitsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a visit by ID' })
  findOne(@Param('id') id: string) {
    return this.visitsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a visit' })
  update(@Param('id') id: string, @Body() dto: UpdateVisitDto) {
    return this.visitsService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a visit' })
  remove(@Param('id') id: string) {
    return this.visitsService.remove(id);
  }
}
