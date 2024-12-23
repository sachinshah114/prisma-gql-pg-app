import { Injectable } from '@nestjs/common';
import { CreateCouponDTO } from 'dto/coupon.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CouponService {
    constructor(private readonly prisma: PrismaService) { }

    async createCoupon(data: CreateCouponDTO) {
        return this.prisma.couponCode.create({ data });
    }
}
