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