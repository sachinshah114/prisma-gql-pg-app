import { InputType, PickType } from "@nestjs/graphql";
import { CreateUserInputDTO } from "./create-user.dto";

@InputType()
export class EditProfileDTO extends PickType(CreateUserInputDTO, ['name', 'phone'] as const) { }