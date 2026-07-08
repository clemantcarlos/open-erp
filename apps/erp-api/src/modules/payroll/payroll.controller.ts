import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { CreateAttendanceDto, UpdateAttendanceDto } from './dto/attendance.dto';
import { CreateLeaveRequestDto, UpdateLeaveRequestDto } from './dto/leave-request.dto';
import { CreatePayrollRecordDto, UpdatePayrollRecordDto } from './dto/payroll-record.dto';
import { Roles } from '../auth/common/decorators/roles.decorator';

@ApiTags('payroll')
@ApiBearerAuth()
@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('employees')
  @ApiOperation({ summary: 'List all employees with optional filters' })
  findEmployees(@Query('page') page?: string, @Query('limit') limit?: string, @Query('search') search?: string, @Query('department') department?: string, @Query('status') status?: string) {
    return this.payrollService.findEmployees({ page: page ? +page : 1, limit: limit ? +limit : 50, search, department, status });
  }

  @Post('employees')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new employee' })
  createEmployee(@Body() dto: CreateEmployeeDto) {
    return this.payrollService.createEmployee(dto);
  }

  @Get('employees/:id')
  @ApiOperation({ summary: 'Get an employee by ID' })
  findOneEmployee(@Param('id') id: string) {
    return this.payrollService.findOneEmployee(id);
  }

  @Patch('employees/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update an employee' })
  updateEmployee(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.payrollService.updateEmployee(id, dto);
  }

  @Roles('admin')
  @Delete('employees/:id')
  @ApiOperation({ summary: 'Delete an employee' })
  removeEmployee(@Param('id') id: string) {
    return this.payrollService.removeEmployee(id);
  }

  @Get('attendance')
  @ApiOperation({ summary: 'List attendance records with optional filters' })
  findAttendance(@Query('page') page?: string, @Query('limit') limit?: string, @Query('employeeId') employeeId?: string, @Query('status') status?: string) {
    return this.payrollService.findAttendance({ page: page ? +page : 1, limit: limit ? +limit : 50, employeeId, status });
  }

  @Get('attendance/:id')
  @ApiOperation({ summary: 'Get an attendance record by ID' })
  findOneAttendance(@Param('id') id: string) {
    return this.payrollService.findOneAttendance(id);
  }

  @Post('attendance')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new attendance record' })
  createAttendance(@Body() dto: CreateAttendanceDto) {
    return this.payrollService.createAttendance(dto);
  }

  @Patch('attendance/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update an attendance record' })
  updateAttendance(@Param('id') id: string, @Body() dto: UpdateAttendanceDto) {
    return this.payrollService.updateAttendance(id, dto);
  }

  @Delete('attendance/:id')
  @ApiOperation({ summary: 'Delete an attendance record' })
  removeAttendance(@Param('id') id: string) {
    return this.payrollService.removeAttendance(id);
  }

  @Get('leave')
  @ApiOperation({ summary: 'List leave requests with optional filters' })
  findLeaveRequests(@Query('page') page?: string, @Query('limit') limit?: string, @Query('employeeId') employeeId?: string, @Query('status') status?: string) {
    return this.payrollService.findLeaveRequests({ page: page ? +page : 1, limit: limit ? +limit : 50, employeeId, status });
  }

  @Get('leave/:id')
  @ApiOperation({ summary: 'Get a leave request by ID' })
  findOneLeaveRequest(@Param('id') id: string) {
    return this.payrollService.findOneLeaveRequest(id);
  }

  @Post('leave')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new leave request' })
  createLeaveRequest(@Body() dto: CreateLeaveRequestDto) {
    return this.payrollService.createLeaveRequest(dto);
  }

  @Patch('leave/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a leave request' })
  updateLeaveRequest(@Param('id') id: string, @Body() dto: UpdateLeaveRequestDto) {
    return this.payrollService.updateLeaveRequest(id, dto);
  }

  @Delete('leave/:id')
  @ApiOperation({ summary: 'Delete a leave request' })
  removeLeaveRequest(@Param('id') id: string) {
    return this.payrollService.removeLeaveRequest(id);
  }

  @Get('records')
  @ApiOperation({ summary: 'List payroll records with optional filters' })
  findPayrollRecords(@Query('page') page?: string, @Query('limit') limit?: string, @Query('employeeId') employeeId?: string, @Query('status') status?: string) {
    return this.payrollService.findPayrollRecords({ page: page ? +page : 1, limit: limit ? +limit : 50, employeeId, status });
  }

  @Get('records/:id')
  @ApiOperation({ summary: 'Get a payroll record by ID' })
  findOnePayrollRecord(@Param('id') id: string) {
    return this.payrollService.findOnePayrollRecord(id);
  }

  @Post('records')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Create a new payroll record' })
  createPayrollRecord(@Body() dto: CreatePayrollRecordDto) {
    return this.payrollService.createPayrollRecord(dto);
  }

  @Patch('records/:id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Update a payroll record' })
  updatePayrollRecord(@Param('id') id: string, @Body() dto: UpdatePayrollRecordDto) {
    return this.payrollService.updatePayrollRecord(id, dto);
  }

  @Delete('records/:id')
  @ApiOperation({ summary: 'Delete a payroll record' })
  removePayrollRecord(@Param('id') id: string) {
    return this.payrollService.removePayrollRecord(id);
  }
}
