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

  async create(dto: CreatePayrollDto): Promise<Payroll> {
    const payroll = this.payrollRepository.create(dto);
    return await this.payrollRepository.save(payroll);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ payrolls: any[]; meta: any }> {
    const countQuery = this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoin('payroll.caregiver', 'caregiver')
      .select('caregiver.profile_id')
      .addSelect('payroll.status')
      .groupBy('caregiver.profile_id')
      .addGroupBy('payroll.status');

    const totalGroups = await countQuery.getRawMany();
    const count = totalGroups.length;

    const data = await this.payrollRepository
      .createQueryBuilder('payroll')
      .leftJoin('payroll.caregiver', 'caregiver')
      .leftJoin('caregiver.profile', 'profile')
      .select('caregiver.profile_id', 'profile_id')
      .addSelect('caregiver.cbu', 'cbu')
      .addSelect('caregiver.mercado_pago_alias', 'mercado_pago_alias')
      .addSelect('profile.full_name', 'full_name')
      .addSelect('SUM(payroll.total_hours)', 'totalHours')
      .addSelect('SUM(payroll.total_amount)', 'totalAmount')
      .addSelect('payroll.status', 'status')
      .groupBy('caregiver.profile_id')
      .addGroupBy('profile.full_name')
      .addGroupBy('payroll.status')
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
}
