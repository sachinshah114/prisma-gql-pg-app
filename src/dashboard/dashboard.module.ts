import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [DashboardService, DashboardResolver, PrismaService]
})
export class DashboardModule { }
