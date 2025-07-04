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
