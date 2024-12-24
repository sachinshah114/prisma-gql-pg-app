import { Field, InputType } from "@nestjs/graphql";
import { IsNumber, IsOptional } from "class-validator";

@InputType()
export class AddToCartDTO {
    @IsOptional()
    userId: number;

    @Field()
    @IsNumber()
    productId: number;

    @Field()
    @IsNumber()
    quantity: number;
}

@InputType()
export class RemoveItemFromDTO {
    @Field()
    @IsNumber()
    id: number;
}