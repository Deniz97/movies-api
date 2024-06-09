import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  IsString,
  IsHexadecimal,
  IsByteLength,
} from 'class-validator';

export function IsDbId() {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    IsHexadecimal(),
    IsByteLength(24, 24),
  );
}
