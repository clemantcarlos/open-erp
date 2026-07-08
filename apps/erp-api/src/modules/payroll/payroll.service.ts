import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateEmployeeDto } from './dto/employee.dto';
import { CreateAttendanceDto } from './dto/attendance.dto';
import { CreateLeaveRequestDto } from './dto/leave-request.dto';
import { CreatePayrollRecordDto } from './dto/payroll-record.dto';

@Injectable()
export class PayrollService {
  constructor(private readonly prisma: PrismaService) {}

  // Employees
  async findEmployees(params?: { page?: number; limit?: number; search?: string; department?: string; status?: string }) {
    const { page = 1, limit = 50, search, department, status } = params || {};
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }];
    if (department) where.department = department;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.employee.findMany({ where, orderBy: { name: 'asc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.employee.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneEmployee(id: string) {
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);
    return employee;
  }

  createEmployee(data: CreateEmployeeDto) {
    return this.prisma.employee.create({
      data: { ...data, hireDate: new Date(data.hireDate), birthDate: data.birthDate ? new Date(data.birthDate) : null },
    });
  }

  async updateEmployee(id: string, data: Record<string, any>) {
    await this.findOneEmployee(id);
    if (data.hireDate) data.hireDate = new Date(data.hireDate);
    if (data.birthDate) data.birthDate = new Date(data.birthDate);
    return this.prisma.employee.update({ where: { id }, data });
  }

  async removeEmployee(id: string) {
    await this.findOneEmployee(id);
    return this.prisma.employee.delete({ where: { id } });
  }

  // Attendance
  async findAttendance(params?: { page?: number; limit?: number; employeeId?: string; status?: string }) {
    const { page = 1, limit = 50, employeeId, status } = params || {};
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.attendanceRecord.findMany({ where, orderBy: { date: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.attendanceRecord.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneAttendance(id: string) {
    const record = await this.prisma.attendanceRecord.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Attendance record ${id} not found`);
    return record;
  }

  createAttendance(data: CreateAttendanceDto) {
    return this.prisma.attendanceRecord.create({ data: { ...data, date: new Date(data.date) } });
  }

  async updateAttendance(id: string, data: Record<string, any>) {
    await this.findOneAttendance(id);
    return this.prisma.attendanceRecord.update({ where: { id }, data });
  }

  async removeAttendance(id: string) {
    await this.findOneAttendance(id);
    return this.prisma.attendanceRecord.delete({ where: { id } });
  }

  // Leave Requests
  async findLeaveRequests(params?: { page?: number; limit?: number; employeeId?: string; status?: string }) {
    const { page = 1, limit = 50, employeeId, status } = params || {};
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.leaveRequest.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.leaveRequest.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneLeaveRequest(id: string) {
    const request = await this.prisma.leaveRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException(`Leave request ${id} not found`);
    return request;
  }

  createLeaveRequest(data: CreateLeaveRequestDto) {
    return this.prisma.leaveRequest.create({
      data: { ...data, startDate: new Date(data.startDate), endDate: new Date(data.endDate) },
    });
  }

  async updateLeaveRequest(id: string, data: Record<string, any>) {
    await this.findOneLeaveRequest(id);
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    return this.prisma.leaveRequest.update({ where: { id }, data });
  }

  async removeLeaveRequest(id: string) {
    await this.findOneLeaveRequest(id);
    return this.prisma.leaveRequest.delete({ where: { id } });
  }

  // Payroll Records
  async findPayrollRecords(params?: { page?: number; limit?: number; employeeId?: string; status?: string }) {
    const { page = 1, limit = 50, employeeId, status } = params || {};
    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.payrollRecord.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.payrollRecord.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOnePayrollRecord(id: string) {
    const record = await this.prisma.payrollRecord.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`Payroll record ${id} not found`);
    return record;
  }

  createPayrollRecord(data: CreatePayrollRecordDto) {
    return this.prisma.payrollRecord.create({
      data: { ...data, paidDate: data.paidDate ? new Date(data.paidDate) : null },
    });
  }

  async updatePayrollRecord(id: string, data: Record<string, any>) {
    await this.findOnePayrollRecord(id);
    if (data.paidDate) data.paidDate = new Date(data.paidDate);
    return this.prisma.payrollRecord.update({ where: { id }, data });
  }

  async removePayrollRecord(id: string) {
    await this.findOnePayrollRecord(id);
    return this.prisma.payrollRecord.delete({ where: { id } });
  }
}
