import { InputType, Field } from '@nestjs/graphql';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsOptional,
    IsPhoneNumber,
} from 'class-validator';
import { UserRole } from 'entity/user.entity';

@InputType()
export class CreateUserInputDTO {
    @Field()
    @IsString()
    @MinLength(3)
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @Field()
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @Field()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @Field({ nullable: true })
    @IsPhoneNumber('GB', { message: 'Invalid phone number' })
    @IsOptional()
    phone?: string;

    @IsOptional()
    verificationCode?: string;

    @IsOptional()
    role?: UserRole.USER;
}
