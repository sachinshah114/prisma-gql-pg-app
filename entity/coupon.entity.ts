import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CouponCode {
    @Field(() => ID)
    id: number;

    @Field()
    code: string;

    @Field()
    validuntil: Date;

    @Field()
    discountPercentage: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}