import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
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

        const { validuntil, ...rest } = createCouponDTO;

        // Convert the validuntil field from yyyy-MM-dd to a Date instance
        const formattedDate = validateDateAndReturnDate(validuntil);

        // Use a new object for processing
        const processedCoupon = {
            ...rest,
            validuntil: formattedDate,
        };


        await this.couponService.createCoupon(processedCoupon as CouponCode);
        return { message: "Coupon code created successfully" }.message.toString();
    }
}
