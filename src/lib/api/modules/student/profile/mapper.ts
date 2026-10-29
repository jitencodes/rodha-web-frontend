import {
  mapBookDispatches,
  mapRegistrationRecord,
} from "@/lib/api/modules/student/registration/mapper";
import type { StudentProfileDetailApi } from "@/lib/api/modules/student/registration/types";
import type { StudentProfileViewModel } from "./types";

export function mapStudentProfileDetail(
  data: StudentProfileDetailApi
): StudentProfileViewModel | null {
  const id = typeof data.id === "string" ? data.id : "";
  const email = typeof data.email === "string" ? data.email : "";
  if (!id && !email && !data.registration) {
    // Soft empty stub from API
    return {
      id: "",
      email: "",
      mobile: "",
      fullName: "",
      profilePicturePath: null,
      stateId: null,
      stateName: "",
      stateCode: "",
      registration: mapRegistrationRecord(data.registration),
      bookDispatches: mapBookDispatches(data.bookDispatches),
    };
  }

  return {
    id,
    email,
    mobile: typeof data.mobile === "string" ? data.mobile : "",
    fullName: typeof data.fullName === "string" ? data.fullName : "",
    profilePicturePath:
      typeof data.profilePicturePath === "string"
        ? data.profilePicturePath
        : null,
    stateId:
      typeof data.stateId === "number"
        ? data.stateId
        : typeof data.state?.id === "number"
          ? data.state.id
          : null,
    stateName:
      typeof data.state?.name === "string" ? data.state.name : "",
    stateCode:
      typeof data.state?.code === "string" ? data.state.code : "",
    registration: mapRegistrationRecord(data.registration),
    bookDispatches: mapBookDispatches(data.bookDispatches),
  };
}
