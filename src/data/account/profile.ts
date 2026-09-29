import type { AccountProfile } from "@/lib/account/types";
import { ACCOUNT_USER } from "@/data/account/user";

/** Initial profile form values — client-only edits, no API. */
export const ACCOUNT_PROFILE: AccountProfile = {
  firstName: ACCOUNT_USER.firstName,
  lastName: ACCOUNT_USER.lastName,
  email: ACCOUNT_USER.email,
  phone: ACCOUNT_USER.phone,
  avatarUrl: ACCOUNT_USER.avatarUrl,
};

export const ACCOUNT_PROFILE_PAGE_COPY = {
  title: "My Profile",
  subtitle: "Manage your personal information and account security.",
  editLabel: "Edit Profile",
  updateNameTitle: "Update Name",
  changePasswordTitle: "Change Password",
  successName: "Your name has been updated.",
  successPassword: "Your password has been changed.",
} as const;
