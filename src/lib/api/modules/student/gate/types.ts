export type StudentRegistrationStatusViewModel = {
  completed: boolean;
  required: boolean;
  overdue: boolean;
  deadlineAt: string | null;
  firstEnrollmentAt: string | null;
};

export type StudentRegistrationStatusApi = {
  completed?: boolean;
  /** Only for a student in a `registrationActive` package who has not submitted. */
  required?: boolean;
  overdue?: boolean;
  deadlineAt?: string | null;
  firstEnrollmentAt?: string | null;
};

/** `emailVerification` / `mobileVerification` on `GET auth/me`. */
export type StudentVerificationApi = {
  required?: boolean;
  verified?: boolean;
  overdue?: boolean;
  deadlineAt?: string | null;
  signupAt?: string | null;
};

export type StudentVerificationViewModel = {
  required: boolean;
  overdue: boolean;
  deadlineAt: string | null;
};

export type VerificationChannel = "email" | "mobile";

export type StudentGateKind = VerificationChannel | "registration";

/** Everything that can prompt or block a student, from `GET auth/me`. */
export type StudentGateViewModel = {
  email: string;
  mobile: string;
  emailVerification: StudentVerificationViewModel;
  mobileVerification: StudentVerificationViewModel;
  registration: StudentRegistrationStatusViewModel;
};
