import { Field, InputType, PickType } from "@nestjs/graphql";
import { CreateUserInputDTO } from "./create-user.dto";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

@InputType()
export class EditProfileDTO extends PickType(CreateUserInputDTO, ['name', 'phone'] as const) { }