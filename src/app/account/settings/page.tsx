import { redirect } from "next/navigation";

/** Settings nav is hidden; keep route as a soft redirect. */
export default function AccountSettingsPage() {
  redirect("/account/dashboard");
}
