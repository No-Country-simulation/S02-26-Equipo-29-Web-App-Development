import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './payroll.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payroll])],
  exports: [TypeOrmModule],
})
export class PayrollsModule {}
