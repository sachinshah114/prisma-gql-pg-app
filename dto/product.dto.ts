import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class CreateProductDTO {
    @Field()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsNotEmpty()
    description: string;

    @Field(() => Float)
    @IsNotEmpty()
    price: number;

    @IsOptional()
    userId: number;
}

@InputType()
export class UploadProductImageDTO {
    @Field(() => Int)
    @IsNumber()
    productId: number;

    @Field()
    @IsBoolean()
    isDefault: boolean;

    @Field()
    @IsNotEmpty()
    image: string;
}

@InputType()
export class ProductFilterDTO {
    @Field(() => String, { nullable: true, description: "Search term" })
    search?: string;

    @Field(() => Int, { nullable: true, description: "Filter by ID" })
    id?: number;

    @Field(() => Float, { nullable: true, description: 'Filter product with minimum price' })
    minPrice?: number;

    @Field(() => Float, { nullable: true, description: 'Filter product with maximum price' })
    maxPrice?: number;
}

@InputType()
export class PaginationDTO {
    @Field(() => Int, { nullable: true, description: "Number of items per page" })
    limit?: number;

    @Field(() => Int, { nullable: true, description: "Page number to retrieve" })
    page?: number;
}