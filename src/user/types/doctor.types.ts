export type DoctorWithQualifications = {
  id: string;
  userId: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: 'MALE' | 'FEMALE';
  appointmentFee: number;
  currentWorkingPlace: string;
  designation: string;
  averageRating: number;
  qualifications: {
    qualification: {
      id: string;
      name: string;
    };
  }[];
};

export interface DoctorQualificationInfo {
  id: string;
  name: string;
}

export interface DoctorResponseData {
  doctorId: string;
  userId: string;
  name: string;
  email: string;
  role: 'DOCTOR';
  profilePhoto: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: 'MALE' | 'FEMALE';
  appointmentFee: number;
  currentWorkingPlace: string;
  designation: string;
  averageRating: number;
  qualifications: DoctorQualificationInfo[];
}
