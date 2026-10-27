export type StudentRegistrationStatusViewModel = {
  completed: boolean;
  required: boolean;
  overdue: boolean;
  deadlineAt: string | null;
  firstEnrollmentAt: string | null;
};

export type DashboardRegistrationApi = {
  completed?: boolean;
  required?: boolean;
  overdue?: boolean;
  deadlineAt?: string | null;
  firstEnrollmentAt?: string | null;
};

export type DashboardStatusResult =
  | {
      ok: true;
      unauthorized?: false;
      registration: StudentRegistrationStatusViewModel;
    }
  | {
      ok: false;
      unauthorized: true;
      registration: null;
    }
  | {
      ok: false;
      unauthorized?: false;
      registration: null;
    };
