import { Field, ID, InputType } from "@nestjs/graphql";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";


@InputType()
export class CreateAddressInputDTO {

    @Field()
    @IsString()
    @IsNotEmpty({ message: 'Address is required' })
    address1: string;

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

    @Field()
    @IsOptional()
    id?: number;

    @Field({ nullable: true })
    @ValidateIf((o) => o.address1 !== undefined)
    @IsNotEmpty({ message: 'Address1 should not be empty' })
    address1?: string;

    @Field({ nullable: true })
    @ValidateIf((o) => o.address2 !== undefined)
    @IsNotEmpty({ message: 'Address2 should not be empty' })
    address2?: string;

    @Field({ nullable: true })
    @ValidateIf((o) => o.city !== undefined)
    @IsNotEmpty({ message: 'City should not be empty' })
    city?: string;

    @Field({ nullable: true })
    @ValidateIf((o) => o.postcode !== undefined)
    @IsNotEmpty({ message: 'Postcode should not be empty' })
    postcode?: string;

    @Field({ nullable: true })
    @ValidateIf((o) => o.isActive !== undefined)
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive?: boolean;

    @Field({ nullable: true })
    @ValidateIf((o) => o.isDeleted !== undefined)
    @IsBoolean({ message: 'isDeleted must be a boolean' })
    isDeleted?: boolean;
}