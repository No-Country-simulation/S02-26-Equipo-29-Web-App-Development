// src/modules/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller()
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async check() {
    const isDbConnected = this.dataSource.isInitialized;

    return {
      status: 'ok',
      service: 'Care Platform API',
      environment: process.env.NODE_ENV ?? 'development',
      database: isDbConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    };
  }
}
