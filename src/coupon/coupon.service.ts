import { Injectable } from '@nestjs/common';
import { CreateCouponDTO } from 'dto/coupon.dto';
import { CouponCode } from 'entity/coupon.entity';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CouponService {
    constructor(private readonly prisma: PrismaService) { }

    async createCoupon(data: CouponCode) {
        return this.prisma.couponCode.create({ data });
    }
}
