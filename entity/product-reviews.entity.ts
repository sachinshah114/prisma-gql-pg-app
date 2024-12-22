import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "./product.entity";

@ObjectType()
export class ProductReviews {
    @Field(() => Int)
    id: number;

    @Field()
    review: string;

    @Field()
    rate: number;

    @Field()
    productId: number;

    @Field()
    userId: number;

    @Field()
    createdAt: Date;
}