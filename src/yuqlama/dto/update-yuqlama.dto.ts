import { PartialType } from '@nestjs/swagger';
import { CreateYuqlamaDto } from './create-yuqlama.dto';

export class UpdateYuqlamaDto extends PartialType(CreateYuqlamaDto) {}
