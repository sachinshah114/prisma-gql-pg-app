import { Field, ObjectType, OmitType, registerEnumType } from '@nestjs/graphql';

// Define the roles enum
export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

// Register the enum with GraphQL
registerEnumType(UserRole, {
    name: 'UserRole', // This will be the name used in the GraphQL schema
});

@ObjectType()
export class User {
    @Field()
    id: number;

    @Field()
    name: string;

    @Field()
    email: string;

    @Field()
    password?: string;

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

    @Field(() => UserRole, { nullable: true, defaultValue: UserRole.USER })
    role?: UserRole;
}

@ObjectType()
export class GetProfile extends OmitType(User, ['password'] as const) { }