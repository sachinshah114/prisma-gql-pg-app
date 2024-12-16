import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "./product.entity";

@ObjectType()
export class ProductImages {
    @Field(() => Int)
    id: number;

    @Field()
    image: string;

    @Field()
    isDefault: boolean;

    @Field()
    productId: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}