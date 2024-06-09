import { ApiProperty } from '@nestjs/swagger';
import { IsDbId } from '../../guards/decorators';

export class CreateTicketDto {
  @ApiProperty()
  @IsDbId()
  sessionId: string;
}
