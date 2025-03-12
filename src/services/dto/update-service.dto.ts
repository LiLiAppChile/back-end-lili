import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsDate } from 'class-validator';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiPropertyOptional({
    description: 'Fecha de creación',
    example: '2023-06-21T14:56:32Z',
  })
  @IsOptional()
  @IsDate()
  createdAt?: Date;
}
