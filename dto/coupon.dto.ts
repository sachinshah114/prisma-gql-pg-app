import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

@InputType()
export class CreateCouponDTO {
    @Field()
    @IsString()
    @IsNotEmpty()
    code: string;

    @Field()
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    validuntil: Date;

    @Field()
    @IsNumber()
    @Max(100)
    @Min(1)
    discountPercentage: number;
}