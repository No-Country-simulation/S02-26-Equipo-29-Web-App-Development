import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from './config/database.config';

import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profile.module';
import { PatientsModule } from './modules/patients/patient.module';
import { FamilyModule } from './modules/family/family.module';
import { CaregiversModule } from './modules/caregivers/caregiver.module';
import { ShiftsModule } from './modules/shifts/shift.module';
import { PaymentsModule } from './modules/payments/payment.module';
import { PayrollsModule } from './modules/payrolls/payroll.module';
import { MediaModule } from './shared/media/media.module';
import { AdminModule } from './modules/admin/admin.module';
import cloudinaryConfig from './config/cloudinary.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // 🌍 Variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [cloudinaryConfig],
    }),

    // 🗄️ Base de datos
    TypeOrmModule.forRoot(databaseConfig()),

    // 🔐 Auth (login / register / JWT)
    AuthModule,

    // 👤 Profiles (roles, persona)
    ProfilesModule,

    // 🏥 Patients (datos de pacientes)
    PatientsModule,

    // 👪 Family (relaciones familiares)
    FamilyModule,
    // 👩‍⚕️ Caregivers (datos de cuidadores)
    CaregiversModule,
    // 🕒 Shifts (turnos de trabajo)
    ShiftsModule,
    // 💳 Payments (pagos de pacientes)
    PaymentsModule,
    // 🧾 Payrolls (nóminas de cuidadores)
    PayrollsModule,
    // ☁️ Media (Cloudinary)
    MediaModule,
    // 🛠️ Admin (panel de administración)
    AdminModule,
    HealthModule,
  ],
})
export class AppModule {}
