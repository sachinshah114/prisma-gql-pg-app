import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from 'dto/login.dto';
import { LoginResponse } from 'dto/login-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => LoginResponse)
  async login(@Args('login') loginInput: LoginInput): Promise<LoginResponse> {
    console.log(`loginInput ::: `, loginInput);
    return this.authService.logIn(loginInput.email, loginInput.password);
  }
}

/*

mutation {
  login(login: { email: "sachin@gmail.com", password: "Test@1234" }) {
    access_token 
  }
}
  
*/
