import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PayrollsService } from './payrolls.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { ProfileRole } from '../profiles/enums/profile-role.enum';

@Controller('payrolls')
export class PayrollsController {
  constructor(private readonly payrollsService: PayrollsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(ProfileRole.ADMIN)
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.payrollsService.findAll(page, limit, status || 'pending');
  }

  @UseGuards(JwtAuthGuard)
  @Roles(ProfileRole.CAREGIVER)
  @Get('caregiver/:id')
  findAllByCaregiver(
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.payrollsService.findAllByCaregiver(
      id,
      page,
      limit,
      status || 'pending',
    );
  }
}
