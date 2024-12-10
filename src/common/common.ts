import { CanActivate, ExecutionContext, Injectable, NestMiddleware } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { NextFunction } from "express";

export function GenerateRandomAlphaNumericCode(length: number) {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}

export function EmptyCheck(str: string) {
  // return str.trim().length > 0 ? str.trim().toLowerCase() : null
  return str.trim().toLowerCase() || null
}

// export function FilterBodyObject(obj: any) {
//   if (typeof obj !== 'object' || obj === null) {
//     return obj;
//   }

//   if (Array.isArray(obj)) {
//     return obj.map(FilterBodyObject);
//   }

//   const filteredObj: { [key: string]: any } = {};
//   for (const key in obj) {
//     const value = obj[key];
//     const filteredValue = FilterBodyObject(value);

//     if (typeof filteredValue === 'string' && EmptyCheck(filteredValue)) {
//       filteredObj[key] = filteredValue;
//     } else if (filteredValue !== null && filteredValue !== undefined) {
//       filteredObj[key] = filteredValue;
//     }
//   }

//   console.log(`[filteredObj] ::: `, filteredObj);
//   return filteredObj;
// }

export function FilterBodyObject(obj: any): any {
  // Helper function to check if a value is an object
  const isObject = (value: any) =>
    value && typeof value === "object" && !Array.isArray(value);

  // Recursive function to process the object or array
  const recursiveFilter = (item: any): any => {
    if (isObject(item)) {
      // Handle nested objects
      return Object.entries(item).reduce((acc, [key, value]) => {
        const filteredValue = recursiveFilter(value);
        // Only include keys with non-null values
        // if (filteredValue !== null) {
        //   acc[key] = filteredValue;
        // }
        acc[key] = filteredValue;
        return acc;
      }, {} as Record<string, any>);
    } else if (Array.isArray(item)) {
      // Handle arrays
      return item
        .map(recursiveFilter) // Process each element
        .filter((element) => element !== null); // Remove null elements
    } else if (typeof item === "string") {
      // Apply EmptyCheck on strings
      return EmptyCheck(item);
    }
    // Return non-string primitive values as is
    return item;
  };

  return recursiveFilter(obj);
}

@Injectable()
export class FilterObjectGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Convert to GQL context
    const gqlContext = GqlExecutionContext.create(context);

    // Get the variables from the GraphQL request
    const variables = gqlContext.getArgs();

    // Apply filtering to the variables
    if (variables) {
      const filteredVariables = FilterBodyObject(variables);
      Object.assign(variables, filteredVariables); // Overwrite with sanitized data
    }

    return true; // Allow the request to proceed
  }
}