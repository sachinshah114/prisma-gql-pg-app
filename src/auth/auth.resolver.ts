import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from 'dto/login.dto';
import { LoginResponse } from 'dto/login-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => LoginResponse)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginResponse> {
    return this.authService.login(loginInput.email, loginInput.password);
  }
}

/*

mutation {
  login(input: { email: "john@example.com", password: "123456" }) {
    access_token 
  }
}
  
*/
