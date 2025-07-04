import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { omit } from 'src/utils/omit';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createDoctor(dto: CreateDoctorDto) {
    return this.prisma.$transaction(async (tx) => {
      //HASHED PASSWORD
      const hashedPassword = await bcrypt.hash(
        dto.password,
        Number(process.env.SALT_ROUND || 12),
      );

      //CREATE USER
      const user = await tx.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          profilePhoto: dto.profilePhoto
            ? dto.profilePhoto
            : `https://ui-avatars.com/api/?name=${dto.name}&background=random&color=fff`,
          contactNumber: dto.contactNumber,
          role: 'DOCTOR',
        },
        select: {
          id: true,
          name: true,
          email: true,
          contactNumber: true,
          role: true,
        },
      });

      //CREATE DOCTOR
      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          address: dto.address,
          registrationNumber: dto.registrationNumber,
          experience: dto.experience,
          gender: dto.gender,
          appointmentFee: dto.appointmentFee,
          currentWorkingPlace: dto.currentWorkingPlace,
          designation: dto.designation,
          averageRating: dto.averageRating,
        },
      });

      //Create or reuse Qualification entries (based on name)
      const qualificationRecords = await Promise.all(
        dto.qualifications.map(async (name) => {
          const existing = await tx.qualification.findFirst({
            where: { name },
          });
          if (existing) return existing;

          return tx.qualification.create({
            data: {
              name,
            },
          });
        }),
      );

      //CREATE DOCTOR-QUALIFICATION
      await Promise.all(
        qualificationRecords.map(async (qualification) => {
          await tx.doctorQualification.create({
            data: {
              doctorId: doctor.id,
              qualificationId: qualification.id,
            },
          });
        }),
      );

      return user;
    });
  }

  async findADoctor(id: string) {
    //FIND THE DOCTOR
    const result = await this.prisma.doctor.findUnique({
      where: {
        id,
      },
      include: {
        qualifications: {
          include: {
            qualification: true,
          },
        },
        user: true,
      },
    });
    // PASS FALSE TO CONTROLLER IF NOT FOUND
    if (!result || !result.user) {
      return {
        success: false,
      };
    }

    //OMIT THE UNUSED VARS
    const publicUser = omit(result.user, [
      'id',
      'password',
      'needPasswordChange',
      'status',
      'isDeleted',
      'deletedAt',
      'createdAt',
      'updatedAt',
    ]);
    // OMIT AND EXTRACT VALUES
    const doctorData = omit(result, ['user']);
    const { id: doctorId, userId, ...doctor } = doctorData;
    //PASS TRUE TO CONTROLLER IF GOT DATA
    return {
      success: true,
      data: {
        doctorId,
        userId,
        ...publicUser,
        ...doctor,
        qualifications: doctor.qualifications.map((dq) => ({
          id: dq.qualification.id,
          name: dq.qualification.name,
        })),
      },
    };
  }

  async findAllDoctor() {
    //FIND ALL DOCTORS
    const results = await this.prisma.doctor.findMany({
      include: {
        qualifications: {
          include: {
            qualification: true,
          },
        },
        user: true,
      },
    });
    //PASS FALSE TO CONTROLLER IF NOT FOUND
    if (!results) {
      return {
        success: false,
      };
    }
    //PASS TRUE TO CONTROLLER IF GOT DATA
    return {
      success: true,
      // MAP ON EACH DOCTOR IN ARRAY TO MAINTAIN THE SHAPE
      data: results.map((doctor) => {
        if (!doctor.user) return null;
        // OMIT UNUSED VARS AND EXTRACT REQUIRED VARS
        const publicUser = omit(doctor.user, [
          'id',
          'password',
          'needPasswordChange',
          'status',
          'isDeleted',
          'deletedAt',
          'createdAt',
          'updatedAt',
        ]);
        // OMIT UNUSED VARS AND EXTRACT REQUIRED VARS
        const doctorData = omit(doctor, ['user']);
        const { id: doctorId, userId, ...doc } = doctorData;
        //RETURN THE ACTUAL SHAPE
        return {
          doctorId,
          userId,
          ...publicUser,
          ...doc,
          qualifications: doc.qualifications.map((dq) => ({
            id: dq.qualification.id,
            name: dq.qualification.name,
          })),
        };
      }),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
