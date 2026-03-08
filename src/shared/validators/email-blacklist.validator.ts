import * as fs from 'fs';
import * as path from 'path';
import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import {blackList}  from '@shared/validators/blacklist';

@ValidatorConstraint({ async: false })
export class IsNotInBlacklistConstraint
  implements ValidatorConstraintInterface
{
  validate(email: string): boolean {
    if (process.env.NODE_ENV === 'development') return true;

    const emailParse = email.trim().toLowerCase();
    const emailDomain = emailParse.split('@')[1];;
    return !blackList.includes(emailDomain);
  }

  defaultMessage(): string {
    return 'validation.EMAIL_BLACKLIST';
  }
}

export function IsNotInBlacklist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isNotInBlacklist',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNotInBlacklistConstraint,
    });
  };
}
