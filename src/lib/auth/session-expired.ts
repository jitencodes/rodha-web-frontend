import { SOFT_BLOCK_STATUS } from "@/lib/api/soft-block";
import { ApiError } from "@/lib/api/types";
import { requestStudentGateCheck } from "@/lib/student-gate";

export const SESSION_EXPIRED_QUERY = "session_expired";

export function isUnauthorizedStatus(status: number): boolean {
  return status === 401 || status === 403;
}

export function isUnauthorizedError(error: unknown): boolean {
  return error instanceof ApiError && isUnauthorizedStatus(error.status);
}

/** Client-side: clear cookies then send user to login with toast reason. */
export async function expireSessionClient(returnPath?: string): Promise<void> {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  if (returnPath?.startsWith("/") && !returnPath.startsWith("//")) {
    params.set("next", returnPath);
  }
  const qs = params.toString();
  window.location.href = qs
    ? `/api/auth/session-expired?${qs}`
    : "/api/auth/session-expired";
}

/** Wrap client fetch to BFF; expire session on 401/403, open the gate on a soft-block. */
export async function fetchAuthed(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, init);
  if (isUnauthorizedStatus(res.status)) {
    await expireSessionClient();
  } else if (res.status === SOFT_BLOCK_STATUS) {
    requestStudentGateCheck(true);
  }
  return res;
}

/** Login redirect path for RSC `redirect()`. */
export function sessionExpiredLoginPath(returnPath?: string): string {
  const params = new URLSearchParams({ reason: SESSION_EXPIRED_QUERY });
  if (returnPath?.startsWith("/") && !returnPath.startsWith("//")) {
    params.set("next", returnPath);
  }
  return `/login?${params.toString()}`;
}
