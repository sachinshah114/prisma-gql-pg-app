import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "./user.entity";


@ObjectType()
export class Address {

    @Field()
    id: number;

    @Field()
    address1: string;

    @Field({ nullable: true })
    address2?: string;

    @Field()
    city: string;

    @Field()
    postcode: string;

    @Field()
    isActive?: boolean;

    @Field()
    isDeleted?: boolean;

    @Field(() => User)
    user: User;

    @Field()
    userId: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

}