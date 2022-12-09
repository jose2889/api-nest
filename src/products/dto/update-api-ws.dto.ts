import { PartialType } from '@nestjs/mapped-types';
import { CreateApiWSDto } from './create-api-ws.dto';

export class UpdateApiWsDto extends PartialType(CreateApiWSDto) {}