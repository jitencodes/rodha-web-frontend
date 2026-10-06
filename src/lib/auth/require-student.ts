import { redirect } from "next/navigation";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  isUnauthorizedError,
  SESSION_EXPIRED_QUERY,
} from "@/lib/auth/session-expired";

/** Ensure cookie token exists for account RSC pages. */
export async function requireStudentToken(): Promise<string> {
  const token = await getAccessToken();
  if (!token) {
    redirect(`/login?next=/account/dashboard`);
  }
  return token;
}

/**
 * Redirect through the session-expired BFF so cookies are cleared.
 * Pass pathname for return `next` when useful.
 */
export function redirectSessionExpired(returnPath?: string): never {
  const params = new URLSearchParams();
  if (returnPath?.startsWith("/") && !returnPath.startsWith("//")) {
    params.set("next", returnPath);
  }
  const qs = params.toString();
  redirect(
    qs
      ? `/api/auth/session-expired?${qs}`
      : `/api/auth/session-expired`
  );
}

/** Run an authenticated fetch; on 401/403 clear session via redirect. */
export async function withStudentAuth<T>(
  fn: (accessToken: string) => Promise<T>,
  returnPath?: string
): Promise<T> {
  const token = await requireStudentToken();
  try {
    return await fn(token);
  } catch (error) {
    if (isUnauthorizedError(error)) {
      redirectSessionExpired(returnPath);
    }
    throw error;
  }
}

export { isUnauthorizedError, SESSION_EXPIRED_QUERY };
