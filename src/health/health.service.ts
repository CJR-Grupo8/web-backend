import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  appStatus() {
    return { status: 'ok', message: 'API online' };
  }

  async dbStatus() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { db: 'up', message: 'Database connected' };
    } catch (error) {
      return { db: 'down', message: 'Database connection failed', error: String(error) };
    }
  }
}
