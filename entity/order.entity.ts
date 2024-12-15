import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { User } from "./user.entity";
import { Address } from "./address.entity";
import { CouponCode } from "./coupon.entity";

@ObjectType()
export class Order {
    @Field(() => Int)
    id: number;

    @Field(() => User)
    userId: User;

    @Field(() => Address)
    addressId: number;

    @Field(() => CouponCode)
    couponCodeId: number;

    @Field(() => Float)
    price: number

    @Field(() => Float)
    discountPrice: number

    @Field(() => Float)
    total: number

    @Field()
    status: string

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

}