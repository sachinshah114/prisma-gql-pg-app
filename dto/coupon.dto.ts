import { Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, Matches, Max, Min } from "class-validator";

@InputType()
export class CreateCouponDTO {
    @Field()
    @IsString()
    @IsNotEmpty()
    code: string;

    @Field()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in yyyy-MM-dd format' })
    startDate: string; // Accepting string for validation

    @Field()
    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in yyyy-MM-dd format' })
    endDate: string; // Accepting string for validation

    @Field()
    @IsNumber()
    @Max(100)
    @Min(1)
    discountPercentage: number;
}