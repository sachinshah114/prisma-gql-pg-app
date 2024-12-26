import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Order } from "./order.entity";
import { Product } from "./product.entity";

@ObjectType()
export class OrderItems {
    @Field(() => ID)
    id: number

    @Field(() => Order)
    orderId: number;

    @Field(() => Product, { nullable: true })
    productId?: number;

    @Field()
    productPrice?: number;

    @Field()
    productTotal?: number;

    @Field()
    quantity: number;
}