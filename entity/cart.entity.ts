import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Cart {
    @Field()
    userId: number;

    @Field()
    productId: number;

    @Field()
    quantity: number;

    @Field()
    createdAt: Date;
}