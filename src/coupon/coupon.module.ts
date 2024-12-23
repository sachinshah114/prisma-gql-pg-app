import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponResolver } from './coupon.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [CouponService, CouponResolver, PrismaService]
})
export class CouponModule { }
