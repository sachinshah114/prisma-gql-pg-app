import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponResolver } from './coupon.resolver';

@Module({
  providers: [CouponService, CouponResolver]
})
export class CouponModule {}
