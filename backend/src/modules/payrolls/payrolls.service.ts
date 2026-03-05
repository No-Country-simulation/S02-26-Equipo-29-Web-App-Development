import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll } from './payroll.entity';
import { CreatePayrollDto } from '../dto/create-payroll.dto';

@Injectable()
export class PayrollsService {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepository: Repository<Payroll>,
  ) {}

  async findAllByCaregiver(
    id: string,
    page: number = 1,
    limit: number = 10,
    status: string,
  ): Promise<{ payrolls: any[]; meta: any }> {
    const statusLower = status.toLowerCase();
    const countQuery = this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoin('payroll.caregiver', 'caregiver')
      .leftJoin('payroll.payment', 'payment')
      .where('payroll.status IN (:...statuses)', {
        statuses: [statusLower, statusLower.toUpperCase()],
      })
      .andWhere('caregiver.profile_id = :id', { id })
      .select('caregiver.profile_id')
      .addSelect('payroll.status')
      .addSelect('payment.id')
      .groupBy('caregiver.profile_id')
      .addGroupBy('payroll.status')
      .addGroupBy('payment.id');

    const totalGroups = await countQuery.getRawMany();
    const count = totalGroups.length;

    const data = await this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoin('payroll.caregiver', 'caregiver')
      .leftJoin('caregiver.profile', 'profile')
      .leftJoin('payroll.payment', 'payment')
      .where('payroll.status IN (:...statuses)', {
        statuses: [statusLower, statusLower.toUpperCase()],
      })
      .andWhere('caregiver.profile_id = :id', { id })
      .select('caregiver.profile_id', 'profile_id')
      .addSelect('caregiver.cbu', 'cbu')
      .addSelect('caregiver.mercado_pago_alias', 'mercado_pago_alias')
      .addSelect('profile.full_name', 'full_name')
      .addSelect('SUM(payroll.total_hours)', 'totalHours')
      .addSelect('SUM(payroll.total_amount)', 'totalAmount')
      .addSelect('payroll.status', 'status')
      .addSelect('payment.id', 'payment_id')
      .addSelect('ARRAY_AGG(payroll.id)', 'ids')
      .groupBy('caregiver.profile_id')
      .addGroupBy('profile.full_name')
      .addGroupBy('payroll.status')
      .addGroupBy('payment.id')
      .limit(limit)
      .offset((page - 1) * limit)
      .getRawMany();
    return {
      payrolls: data,
      meta: {
        total: count,
        page: Number(page),
        lastPage: Math.ceil(count / limit),
      },
    };
  }

  async create(dto: CreatePayrollDto): Promise<Payroll> {
    const payroll = this.payrollRepository.create(dto);
    return await this.payrollRepository.save(payroll);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status: string,
  ): Promise<{ payrolls: any[]; meta: any }> {
    const statusLower = status.toLowerCase();
    const countQuery = this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoin('payroll.caregiver', 'caregiver')
      .leftJoin('payroll.payment', 'payment')
      .where('payroll.status IN (:...statuses)', {
        statuses: [statusLower, statusLower.toUpperCase()],
      })
      .select('caregiver.profile_id')
      .addSelect('payroll.status')
      .addSelect('payment.id')
      .groupBy('caregiver.profile_id')
      .addGroupBy('payroll.status')
      .addGroupBy('payment.id');

    const totalGroups = await countQuery.getRawMany();
    const count = totalGroups.length;

    const data = await this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoin('payroll.caregiver', 'caregiver')
      .leftJoin('caregiver.profile', 'profile')
      .leftJoin('payroll.payment', 'payment')
      .select('caregiver.profile_id', 'profile_id')
      .where('payroll.status IN (:...statuses)', {
        statuses: [statusLower, statusLower.toUpperCase()],
      })
      .addSelect('caregiver.cbu', 'cbu')
      .addSelect('caregiver.mercado_pago_alias', 'mercado_pago_alias')
      .addSelect('profile.full_name', 'full_name')
      .addSelect('SUM(payroll.total_hours)', 'totalHours')
      .addSelect('SUM(payroll.total_amount)', 'totalAmount')
      .addSelect('payroll.status', 'status')
      .addSelect('payment.id', 'payment_id')
      .addSelect('ARRAY_AGG(payroll.id)', 'ids')
      .groupBy('caregiver.profile_id')
      .addGroupBy('profile.full_name')
      .addGroupBy('payroll.status')
      .addGroupBy('payment.id')
      .limit(limit)
      .offset((page - 1) * limit)
      .getRawMany();
    return {
      payrolls: data,
      meta: {
        total: count,
        page: Number(page),
        lastPage: Math.ceil(count / limit),
      },
    };
  }

  async remove(id: string): Promise<void> {
    await this.payrollRepository.delete(id);
  }

  async findReport(from: Date, to: Date): Promise<any[]> {
    return this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoin('payroll.caregiver', 'caregiver')
      .leftJoin('caregiver.profile', 'profile')
      .leftJoin('payroll.payment', 'payment')
      .where('payroll.created_at >= :from', { from })
      .andWhere('payroll.created_at <= :to', { to })
      .select('caregiver.profile_id', 'profile_id')
      .addSelect('profile.full_name', 'full_name')
      .addSelect('caregiver.cbu', 'cbu')
      .addSelect('caregiver.mercado_pago_alias', 'mercado_pago_alias')
      .addSelect('SUM(payroll.total_hours)', 'totalHours')
      .addSelect('SUM(payroll.total_amount)', 'totalAmount')
      .addSelect('payroll.status', 'status')
      .addSelect('payment.paid_at', 'paid_at')
      .groupBy('caregiver.profile_id')
      .addGroupBy('profile.full_name')
      .addGroupBy('payroll.status')
      .addGroupBy('payment.paid_at')
      .addGroupBy('caregiver.cbu')
      .addGroupBy('caregiver.mercado_pago_alias')
      .getRawMany();
  }
}
