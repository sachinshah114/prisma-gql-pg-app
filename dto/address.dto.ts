import { Field, ID, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


@InputType()
export class CreateAddressInputDTO {

    @Field()
    @IsString()
    @IsNotEmpty({ message: 'Address is required' })
    address: string;

    @Field({ nullable: true })
    @IsOptional()
    address2?: string;

    @Field()
    @IsString()
    @IsNotEmpty({ message: 'City is required' })
    city: string;

    @Field()
    @IsString()
    @IsNotEmpty({ message: 'Postcode is required' })
    postcode: string;
}


@InputType()
export class UpdateAddressInputDTO {

    @Field(() => ID)
    id: number;

    @Field({ nullable: true })
    address: string;

    @Field({ nullable: true })
    address2?: string;

    @Field({ nullable: true })
    city: string;

    @Field({ nullable: true })
    postcode: string;
}