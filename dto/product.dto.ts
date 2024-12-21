import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Product } from 'entity/product.entity';

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
    @IsOptional()
    @IsString()
    search?: string;

    @Field(() => Int, { nullable: true, description: "Filter by ID" })
    @IsOptional()
    @IsNumber()
    id?: number;

    @Field(() => Float, { nullable: true, description: 'Filter product with minimum price' })
    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @Field(() => Float, { nullable: true, description: 'Filter product with maximum price' })
    @IsOptional()
    @IsNumber()
    maxPrice?: number;

    @Field(() => Boolean, { nullable: true, description: 'Used when user wants his own added product list only' })
    @IsOptional()
    @IsBoolean()
    ownProductsOnly?: boolean;
}

@InputType()
export class PaginationDTO {
    @Field(() => Int, { nullable: true, description: "Number of items per page" })
    @IsOptional()
    @IsNumber()
    limit: number;

    @Field(() => Int, { nullable: true, description: "Page number to retrieve" })
    @IsOptional()
    @IsNumber()
    page: number;
}

@ObjectType()
export class ProductListResponse {
    @Field(() => [Product], { description: "List of products" })
    list: Product[];

    @Field(() => Int, { description: "Total number of products" })
    total: number;
}