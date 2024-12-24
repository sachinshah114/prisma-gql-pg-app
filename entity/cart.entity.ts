import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "./product.entity";

@ObjectType()
export class Cart {
    @Field()
    userId: number;

    @Field()
    productId: number;

    @Field(() => Product, { nullable: true })
    product?: Product;

    @Field()
    quantity: number;

    @Field()
    createdAt: Date;
}