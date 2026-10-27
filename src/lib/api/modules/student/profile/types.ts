import type {
  BookDispatchViewModel,
  StudentRegistrationRecord,
} from "@/lib/api/modules/student/registration/types";

export type StudentProfileViewModel = {
  id: string;
  email: string;
  mobile: string;
  fullName: string;
  profilePicturePath: string | null;
  stateId: number | null;
  stateName: string;
  stateCode: string;
  registration: StudentRegistrationRecord | null;
  bookDispatches: BookDispatchViewModel[];
};
