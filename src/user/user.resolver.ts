import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'entity/user.entity';
import { UserService } from './user.service';
import { CreateUserInputDTO } from 'dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { EncryptPassword } from 'src/common/encrypt';
import { GenerateRandomAlphaNumericCode } from 'src/common/common';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return this.userService.getUser();
    }

    @Mutation(() => User)
    async createUser(@Args('createUserInput') createUserInputDTO: CreateUserInputDTO) {

        //First check, Is user is Unique by Email or not...
        const isUserUniqueByEmail = await this.userService.isUserUniqueByEmail(createUserInputDTO.email);
        if (isUserUniqueByEmail)
            throw new BadRequestException('Email address already exist');

        //User is unique, now encrypt the password to save in database...
        createUserInputDTO.password = await EncryptPassword(createUserInputDTO.password);

        //Generate a random verification code to varify later on...
        createUserInputDTO.verificationCode = await GenerateRandomAlphaNumericCode(6);

        return this.userService.createUser(createUserInputDTO);
    }
}


/*

mutation {
  createUser(createUserInput: { 
    name: "test", 
    email: "john@example.com", 
    password: "123456",
    phone: "7774846405"
  }) {
    id
    name
    email
  }
}
  
*/
