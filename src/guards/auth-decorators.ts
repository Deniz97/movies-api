import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const Anonymous = () => SetMetadata('skip-auth', true);

export const Authenticated = () => null; // Authentication is applied by default

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
