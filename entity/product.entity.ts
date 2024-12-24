import { Field, Float, GraphQLISODateTime, ID, Int, ObjectType } from "@nestjs/graphql";
import { ProductImages } from "./product-images.entity";
import { ProductReviews } from "./product-reviews.entity";
import { User } from "./user.entity";

@ObjectType()
export class Product {
    @Field(() => ID)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => Float)
    price: number;

    @Field(() => [ProductImages], { nullable: true })
    ProductImages?: ProductImages[];

    @Field(() => [ProductReviews], { nullable: true })
    ProductReviews?: ProductReviews[]

    @Field(() => Int)
    userId: number;

    @Field()
    isActive: boolean;

    @Field()
    hasImage: boolean;

    @Field(() => GraphQLISODateTime)
    createdAt?: Date;

    @Field(() => GraphQLISODateTime)
    updatedAt?: Date;

    @Field(() => Int, { nullable: true })
    reviewsCount: number;
}