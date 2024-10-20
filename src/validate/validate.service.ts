// import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
// import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ async: true })
// @Injectable()
export class ValidateService implements ValidatorConstraintInterface {
  // constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const field = args.property; // The field name (e.g., 'email' or 'username')
    // console.log('Prisma Service:', this.prisma);
    const prisma = new PrismaClient();
    // Check if the field is one of the unique fields
    let user;
    if (field === 'email') {
      user = await prisma.users.findUnique({
        where: { email: value },
      });
    } else if (field === 'username') {
      user = await prisma.users.findUnique({
        where: { username: value },
      });
    } else {
      return false; // If the field isn't one of the unique fields, return false
    }

    return !user; // Return true if the value is unique
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} is already in use.`;
  }
}

export function IsUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateService,
    });
  };
}
