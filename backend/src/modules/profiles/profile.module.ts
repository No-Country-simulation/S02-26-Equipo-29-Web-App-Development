import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Profile } from './profile.entity';
import { ProfilesService } from './profile.service';
import { ProfilesController } from './profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
  exports: [ProfilesService],
})
export class ProfilesModule {}
