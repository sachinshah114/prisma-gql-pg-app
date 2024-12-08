import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    isAdmin: boolean;

    @Field()
    isVerified: boolean;

    @Field()
    verificationCode: string;

    @Field()
    phone: string;

    @Field()
    isBlocked: boolean;
}