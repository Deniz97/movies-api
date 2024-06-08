import { User } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

export type HttpRequest = ExpressRequest;
export type UserwithoutPassword = Omit<User, 'hashedPassword'>;
export type JwtRequest = { user: UserwithoutPassword } & HttpRequest;
