import { Field, Float, InputType, Int, ObjectType } from "@nestjs/graphql";
import { PaginationDTO } from "./product.dto";
import { IsEnum, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { Order } from "entity/order.entity";

@InputType()
export class PlaceOrderDTO {

}
export enum OrderStatus {
    PENDING = 'pending',
    PROCESSED = 'processed',
    DISPATCHED = 'dispatched',
    FINISHED = 'finished',
    CANCELED = 'canceled',
}

@InputType()
export class GetOrderHistoryDTO {

    @Field(() => Int, { nullable: true, description: "Filter by ID" })
    @IsOptional()
    @IsNumber()
    id?: number;

    @Field(() => String, { nullable: true })
    @IsEnum(OrderStatus, { message: 'Status must be one of: PENDING, PROCESSED, DISPATCHED, FINISHED, CANCELED' })
    status?: string;

    @Field(() => Float, { nullable: true, description: 'Filter order with minimum price' })
    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @Field(() => Float, { nullable: true, description: 'Filter order with maximum price' })
    @IsOptional()
    @IsNumber()
    maxPrice?: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in yyyy-MM-dd format' })
    fromDate?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in yyyy-MM-dd format' })
    toDate?: string;

}

@ObjectType()
export class OrderListResponse {
    @Field(() => [Order], { description: "List of orders" })
    list: Order[];

    @Field(() => Int, { description: "Total number of orders" })
    total: number;
}