import { User, UserRole } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

export type HttpRequest = ExpressRequest;
export type UserwithoutPassword = Omit<User, 'hashedPassword'>;
export type JwtUser = {
  sub: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};
export type JwtRequest = { user: JwtUser } & HttpRequest;
