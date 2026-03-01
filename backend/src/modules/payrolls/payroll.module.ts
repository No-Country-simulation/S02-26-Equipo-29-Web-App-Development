import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './payroll.entity';
import { PayrollsService } from './payrolls.service';
import { PayrollsController } from './payrolls.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payroll])],
  exports: [TypeOrmModule],
  controllers: [PayrollsController],
  providers: [PayrollsService],
})
export class PayrollsModule {}
