import { Module } from '@nestjs/common';
import { OrderResolver } from './order.resolver';
import { PrismaService } from 'src/prisma.service';
import { OrderService } from './order.service';

@Module({
  providers: [OrderService, OrderResolver, PrismaService]
})
export class OrderModule { }
