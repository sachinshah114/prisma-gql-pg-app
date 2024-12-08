import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'entity/user.entity';
import { UserService } from './user.service';
import { CreateUserInputDTO } from 'dto/create-user.dto';

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @Query(() => [User])
    async users(): Promise<User[]> {
        return this.userService.getUser();
    }

    @Mutation(() => User)
    async createUser(@Args('createUserInput') createUserInputDTO: CreateUserInputDTO) {
        return this.userService.createUser(createUserInputDTO);
    }
}
