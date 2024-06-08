import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  sessionId: string;
}
