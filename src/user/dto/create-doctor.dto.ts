import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Gender } from 'generated/prisma';
import { CreateUserDto } from './create-user.dto';

export class CreateDoctorDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  readonly registrationNumber: string;

  @IsNumber()
  @IsNotEmpty()
  readonly experience: number;

  @IsEnum(Gender)
  readonly gender: Gender;

  @IsNumber()
  @IsNotEmpty()
  readonly appointmentFee: number;

  @IsString()
  @IsNotEmpty()
  readonly currentWorkingPlace: string;

  @IsString()
  @IsNotEmpty()
  readonly designation: string;

  @IsNumber()
  @IsNotEmpty()
  averageRating: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  readonly qualifications: string[];
}
