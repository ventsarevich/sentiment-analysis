import { IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString({ each: true })
  readonly texts: string[];
}
