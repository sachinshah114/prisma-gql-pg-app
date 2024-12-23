import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { CreateCouponDTO } from 'dto/coupon.dto';
import { UserRole } from 'entity/user.entity';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ValidateGuard } from 'src/auth/validate.guard';
import { CouponService } from './coupon.service';

@Resolver()
export class CouponResolver {
    constructor(private readonly couponService: CouponService) { }

    @Mutation(() => String)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN]), ValidateGuard)
    async createCoupon(@Args('createCoupon') createCouponDTO: CreateCouponDTO, @Context() context: any) {
        console.log(`createCouponDTO ::: `, createCouponDTO);
        createCouponDTO.validuntil = new Date(createCouponDTO.validuntil);
        await this.couponService.createCoupon(createCouponDTO);
        return { message: "Coupon code created successfully" }.message.toString();
    }
}
