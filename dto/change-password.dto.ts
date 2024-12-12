import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

@InputType()
export class ChangePasswordDTO {
    @Field()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @Field()
    @IsString()
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'New password is required' })
    new_password: string;

    @Field()
    @IsString()
    @MinLength(6, { message: 'Confirm password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'Confirm password is required' })
    confirm_password: string;



}