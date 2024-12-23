import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateCouponDTO } from 'dto/coupon.dto';
import { UserRole } from 'entity/user.entity';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ValidateGuard } from 'src/auth/validate.guard';
import { CouponService } from './coupon.service';
import { CouponCode } from 'entity/coupon.entity';
import { validateDateAndReturnDate } from 'src/common/common';

@Resolver()
export class CouponResolver {
    constructor(private readonly couponService: CouponService) { }

    @Mutation(() => String)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN]), ValidateGuard)
    async createCoupon(@Args('createCoupon') createCouponDTO: CreateCouponDTO) {

        const { startDate, endDate, ...rest } = createCouponDTO;

        // Convert the validuntil field from yyyy-MM-dd to a Date instance
        const formattedStartDate = validateDateAndReturnDate(startDate);
        const formattedEndDate = validateDateAndReturnDate(endDate);

        // Use a new object for processing
        const processedCoupon = {
            ...rest,
            startDate: formattedStartDate,
            endDate: formattedEndDate
        };


        await this.couponService.createCoupon(processedCoupon as CouponCode);
        return { message: "Coupon code created successfully" }.message.toString();
    }
}
