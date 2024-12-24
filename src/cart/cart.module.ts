import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { PrismaService } from 'src/prisma.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [ProductModule],
  providers: [CartService, CartResolver, PrismaService]
})
export class CartModule { }
