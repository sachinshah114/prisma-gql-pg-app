import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

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

export function EmptyCheck(str: string, key?: string) {
  // Skip lowercase transformation for specific keys
  //console.log(`Key name is ::: `, key);

  // if (key === "password" || key === "confirmPassword") {
  //   console.log(`password key found ::::::::::::::::::::::: ::: `);
  //   return str.trim() || null; // Only trim, no lowercase
  // }
  return str.trim().toLowerCase() || null
}

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
        .map((element) => recursiveFilter(element)) // Process each element
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

    //Exampt some route from hear...    
    if ('verifyEmail' in gqlContext.getArgs() ||
      'forgotpassword' in gqlContext.getArgs() ||
      'createUserInput' in gqlContext.getArgs() ||
      'login' in gqlContext.getArgs()) {
      return true;
    }


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


//This function will accept date in string format and validate. if it's wrong, throw an error.
//If it's correct, will return a date
export function validateDateAndReturnDate(str: string) {
  const [year, month, day] = str.split('-').map(Number);
  const formattedDate = new Date(year, month - 1, day);

  if (isNaN(formattedDate.getTime())) {
    throw new BadRequestException('Invalid date format. Must be a valid date in yyyy-MM-dd format.');
  }

  return formattedDate;

}

export function isDateBetween(startDate: Date, endDate: Date): boolean {
  const today = new Date();

  return today >= startDate && today <= endDate;
}