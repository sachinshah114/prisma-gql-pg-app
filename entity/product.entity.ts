import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { ProductImages } from "./product-images.entity";
import { ProductReviews } from "./product-reviews.entity";
import { User } from "./user.entity";

@ObjectType()
export class Product {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => Float)
    price: number;

    @Field(() => [ProductImages], { nullable: true })
    prductImages?: ProductImages[];

    @Field(() => [ProductReviews], { nullable: true })
    ProductReviews?: ProductReviews[]

    @Field(() => Int)
    userId: User;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}