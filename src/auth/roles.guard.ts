import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly requiredRole: string[]) { }

    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context);
        const user = ctx.getContext().req.user;
        console.log("Role guard User ::: ", user);
        return this.requiredRole.includes(user.role);
        // return user.role === this.requiredRole; // Match user role with the required role
    }
}

// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Roles } from './roles.decorator';

// @Injectable()
// export class RoleGuard implements CanActivate {
//     constructor(private reflector: Reflector) { }

//     canActivate(context: ExecutionContext): boolean {
//         const roles = this.reflector.get(Roles, context.getHandler());
//         if (!roles) {
//             return true;
//         }
//         const request = context.switchToHttp().getRequest();
//         const user = request.user;
//         console.log("Role guard User ::: ", user);
//         return true;
//     }
// }