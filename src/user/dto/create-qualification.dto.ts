import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQualificationDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}
