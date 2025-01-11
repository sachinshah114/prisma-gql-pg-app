import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
    @Field()
    access_token: string;

    @Field()
    name: string;

    @Field()
    email: string;
}
