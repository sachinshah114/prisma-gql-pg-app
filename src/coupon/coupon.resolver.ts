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

@Resolver()
export class CouponResolver {
    constructor(private readonly couponService: CouponService) { }

    @Mutation(() => String)
    @UseGuards(JwtAuthGuard)
    @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN]), ValidateGuard)
    async createCoupon(@Args('createCoupon') createCouponDTO: CreateCouponDTO) {

        const { validuntil, ...rest } = createCouponDTO;

        // Convert the validuntil field from yyyy-MM-dd to a Date instance
        const [year, month, day] = validuntil.split('-').map(Number);
        const formattedDate = new Date(year, month - 1, day);

        if (isNaN(formattedDate.getTime())) {
            throw new BadRequestException('Invalid date format. Must be a valid date in yyyy-MM-dd format.');
        }

        // Use a new object for processing
        const processedCoupon = {
            ...rest,
            validuntil: formattedDate,
        };


        await this.couponService.createCoupon(processedCoupon as CouponCode);
        return { message: "Coupon code created successfully" }.message.toString();
    }
}
