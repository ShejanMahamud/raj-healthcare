import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DoctorWithQualifications } from './types/doctor.types';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/doctor')
  createDoctor(@Body() CreateDoctorDto: CreateDoctorDto) {
    return this.userService.createDoctor(CreateDoctorDto);
  }

  @Get('/doctor/:id')
  async findADoctor(@Param('id') id: string) {
    const result: DoctorWithQualifications | null =
      await this.userService.findADoctor(id);

    if (!result) {
      return {
        success: false,
        message: 'Doctor Not Found!',
      };
    }
    return {
      success: true,
      message: 'Doctor Found!',
      data: {
        ...result,
        qualifications: result.qualifications.map((dq) => ({
          id: dq.qualification.id,
          name: dq.qualification.name,
        })),
      },
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
