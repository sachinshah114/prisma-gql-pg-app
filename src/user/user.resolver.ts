import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetProfile, User, UserRole } from 'entity/user.entity';
import { UserService } from './user.service';
import { CreateUserInputDTO, VerifyEmailDTO } from 'dto/create-user.dto';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { EncryptPassword } from 'src/common/encrypt';
import { GenerateRandomAlphaNumericCode } from 'src/common/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Query(() => GetProfile)
  @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN, UserRole.USER]))
  async getProfile(@Context() context: any): Promise<User> {
    const user = context.req.user as User;
    return this.userService.getProfile(user.email);
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

    const newUser = await this.userService.createUser(createUserInputDTO);

    //Now send email to this user in async mode as in background... 
    this.userService.sendVerificationEmail(newUser as User);

    return newUser;
  }

  @Mutation(() => String)
  async verifyEmail(@Args('verifyEmail') verifyEmailDTO: VerifyEmailDTO) {
    console.log(`Token is ::: `, verifyEmailDTO.token);
    return await this.userService.verifyUserByEmailToken(verifyEmailDTO.token);
  }

}


/*

mutation {
  createUser(createUserInput: { 
    name: "sachin", 
    email: "sachin@gmail.com", 
    password: "123456",
    phone: "7774846405"
  }) {
    id
    name
    email
  }
}
  
*/
