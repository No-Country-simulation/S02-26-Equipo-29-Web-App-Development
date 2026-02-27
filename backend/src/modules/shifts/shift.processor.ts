import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ShiftType } from './constants/shifts-procesor';
import { MailService } from '../email/email.service';

@Processor('shifts')
export class ShiftsConsumer extends WorkerHost {
  constructor(private readonly mailService: MailService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case ShiftType.assigned:
        await this.mailService.sendShiftAssigned(job.data);
        break;
      case ShiftType.confirmed:
        await this.mailService.sendShiftConfirmed(job.data);
        break;
      case ShiftType.rejected:
        console.log('Turno rechazado');
        break;
      case ShiftType.completed:
        console.log('Turno completado');
        break;
      case ShiftType.pending:
        console.log('Turno pendiente');
        break;
      default:
        console.log('Unknown job type:', job.name);
    }
    console.log('Procesando turno:', job.name, job.data);

    await new Promise((r) => setTimeout(r, 2000));

    console.log('Turno finalizado');
  }
}
