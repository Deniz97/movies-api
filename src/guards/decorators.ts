import { SetMetadata, applyDecorators } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import {
  IsByteLength,
  IsHexadecimal,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export const Anonymous = () => SetMetadata('skip-auth', true);

export const Authenticated = () => null; // Authentication is applied by default

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export function IsDbId() {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    IsHexadecimal(),
    IsByteLength(24, 24),
  );
}
