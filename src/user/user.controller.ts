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
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //CREATE DOCTOR WITH CreateDoctorDto
  @Post('/doctor')
  async createDoctor(@Body() CreateDoctorDto: CreateDoctorDto) {
    const result = await this.userService.createDoctor(CreateDoctorDto);
    if (!result) {
      return {
        success: false,
        message: 'Doctor Creation Failed!',
      };
    }
    return {
      success: true,
      message: 'Doctor Created Successfully!',
    };
  }
  //TAKE A PARAM AND FIND A ACTUAL DATA
  @Get('/doctor/:id')
  async findADoctor(@Param('id') id: string) {
    const result = await this.userService.findADoctor(id);

    if (!result.success) {
      return {
        success: false,
        message: 'Doctor Not Found!',
      };
    }
    return {
      success: true,
      message: 'Doctor Found!',
      data: result.data,
    };
  }
  //FIND ALL THE DOCTORS
  @Get('/doctors')
  async findAllDoctor() {
    const result = await this.userService.findAllDoctor();
    if (!result) {
      return {
        success: false,
        message: 'There is no doctor!',
      };
    }
    return {
      success: true,
      message: 'All Doctors Retrieved Successfully!',
      data: result,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
