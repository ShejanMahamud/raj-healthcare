import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'generated/prisma';
import { CreateUserDto } from './create-user.dto';

export class CreatePatient extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  readonly gender: Gender;
}
