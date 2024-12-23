import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CouponCode {
    @Field(() => ID)
    id: number;

    @Field()
    code: string;

    @Field()
    startDate: Date;

    @Field()
    endDate: Date;

    @Field()
    discountPercentage: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}