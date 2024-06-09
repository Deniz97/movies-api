import { ApiProperty } from '@nestjs/swagger';
import { IsDbId } from '../../guards/validation-decorators';

export class CreateTicketDto {
  @ApiProperty()
  @IsDbId()
  sessionId: string;
}
