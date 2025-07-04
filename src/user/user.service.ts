import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma-service/prisma.service';
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

      return { user, doctor, qualifications: qualificationRecords };
    });
  }

  async findADoctor(id: string) {
    return this.prisma.doctor.findUnique({
      where: {
        id,
      },
      include: {
        qualifications: {
          include: {
            qualification: true,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all user`;
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
