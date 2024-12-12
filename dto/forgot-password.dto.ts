import { Field, InputType, PickType } from "@nestjs/graphql";
import { ChangePasswordDTO } from "./change-password.dto";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class ForgotPasswordDTO extends PickType(ChangePasswordDTO, ['new_password', 'confirm_password'] as const) {
    @Field()
    @IsString()
    @IsNotEmpty({ message: 'Forgotpassword token is required' })
    token: string;
}