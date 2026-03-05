import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { formatDate } from '../../common/utils/formatDate';
import {
  ShiftAssignedMailPayload,
  ShiftConfirmedMailPayload,
} from '../shifts/constants/shift.payload';

@Injectable()
export class MailService {
  private transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });
  }

  async sendShiftConfirmed(payload: ShiftConfirmedMailPayload) {
    await this.transporter.sendMail({
      from: `"Sistema de Turnos" <${this.config.get('MAIL_USER')}>`,
      to: payload.to,
      subject: 'Turno confirmado',
      html: `<h2>Hola! ${payload.patient} tu turno fue confirmado</h2>
      <p>${formatDate(new Date(payload.date))}, tu cuidador es ${payload.caregiver}</p>`,
    });
  }

  async sendShiftAssigned(payload: ShiftAssignedMailPayload) {
    await this.transporter.sendMail({
      from: `"Sistema de Turnos" <${this.config.get('MAIL_USER')}>`,
      to: payload.to,
      subject: 'Turno asignado',
      html: `<h2>Hola! ${payload.caregiver} te asignaron un turno</h2><p>${formatDate(new Date(payload.date))}, tu paciente es ${payload.patient}</p>`,
    });
  }
}
