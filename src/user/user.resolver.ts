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
import { ChangePasswordDTO } from 'dto/change-password.dto';
import { AuthService } from 'src/auth/auth.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) { }

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
    return await this.userService.verifyUserByEmailToken(verifyEmailDTO.token);
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard)
  @UseGuards(GqlAuthGuard, new RoleGuard([UserRole.ADMIN, UserRole.USER]))
  async changePassword(@Args('changePassword') changePasswordDTO: ChangePasswordDTO, @Context() context: any) {
    //First compare new password and confirm password must be same... 
    if (changePasswordDTO.new_password !== changePasswordDTO.confirm_password)
      return new BadRequestException(`Password and confirm password should match`);

    //Now validate user's old password is right or not... 
    const user = context.req.user as User;
    const userDetails = await this.userService.findOneByEmail(user.email);
    const isExistingPasswordMatch = await this.authService.comparePassword(changePasswordDTO.password, userDetails.password);
    if (!isExistingPasswordMatch)
      return new BadRequestException("Current password not matched.");

    //Make a hash of new password...
    const hash = await EncryptPassword(changePasswordDTO.new_password);

    //Update a new password in db...
    await this.userService.updateUserDetails({
      password: hash
    } as User, user);
    return { message: "Password Changed Successfully" }.message.toString();

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


mutation{
  verifyEmail(verifyEmail: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhY2hpbkBnbWFpbC5jb20iLCJpZCI6MTgsImlhdCI6MTczMzkzODE1MiwiZXhwIjoxNzMzOTQxNzUyfQ.Ltf29vb_fCKFnD5Vuf8s2bd71qC4rrGe0cmbuwTBVlo"
  })
}
  


query {
  getProfile{
    name,
    email,
    isAdmin,
    role
  }
}
*/
