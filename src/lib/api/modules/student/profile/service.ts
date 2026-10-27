import { apiGet, apiPatch } from "@/lib/api/client";
import {
  getApiBaseUrl,
  getApiKey,
  getApiSource,
} from "@/lib/api/env";
import { ApiError, type ApiEnvelope } from "@/lib/api/types";
import type { StudentProfileDetailApi } from "@/lib/api/modules/student/registration/types";
import { mapStudentProfileDetail } from "./mapper";
import type { StudentProfileViewModel } from "./types";

export type { StudentProfileViewModel } from "./types";

export async function getStudentProfile(
  accessToken: string
): Promise<StudentProfileViewModel | null> {
  try {
    const data = await apiGet<StudentProfileDetailApi>(
      "api/website/student/profile",
      {
        accessToken,
        cache: "no-store",
      }
    );
    return mapStudentProfileDetail(data ?? {});
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getStudentProfile]", error);
    }
    return null;
  }
}

export async function updateStudentPassword(
  accessToken: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await apiPatch(
    "api/website/student/password",
    {
      currentPassword,
      newPassword,
    },
    { accessToken }
  );
}

export async function updateProfilePicture(
  accessToken: string,
  file: Blob,
  fileName: string
): Promise<unknown> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new ApiError("NEXT_PUBLIC_API_BASE_URL is not configured", 0);
  }

  const form = new FormData();
  form.append("profilePicture", file, fileName);

  const headers: HeadersInit = {
    Accept: "application/json",
    "x-source": getApiSource(),
    Authorization: `Bearer ${accessToken}`,
  };
  const apiKey = getApiKey();
  if (apiKey) headers["x-api-key"] = apiKey;

  const response = await fetch(`${baseUrl}api/auth/me/profile-picture`, {
    method: "PATCH",
    headers,
    body: form,
    cache: "no-store",
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError("Invalid JSON from profile-picture", response.status);
  }

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as { message: unknown }).message === "string"
        ? (body as { message: string }).message
        : `Request failed: ${response.status}`;
    throw new ApiError(message, response.status, body);
  }

  const envelope = body as ApiEnvelope<unknown>;
  if (!envelope || envelope.success !== true) {
    throw new ApiError(
      envelope?.message || "Profile picture update failed",
      response.status,
      body
    );
  }

  return envelope.data;
}

export async function getGraphySso(accessToken: string): Promise<{
  ssoToken: string;
  ssoUrl: string;
  graphyLearnerId: string;
} | null> {
  const data = await apiGet<{
    graphy?: {
      ssoToken?: string;
      ssoUrl?: string;
      graphyLearnerId?: string;
    };
  }>("api/graphy/sso?format=json", {
    accessToken,
    cache: "no-store",
  });

  const graphy = data.graphy;
  if (!graphy) return null;
  return {
    ssoToken: graphy.ssoToken?.trim() || "",
    ssoUrl: graphy.ssoUrl?.trim() || "",
    graphyLearnerId: graphy.graphyLearnerId?.trim() || "",
  };
}
