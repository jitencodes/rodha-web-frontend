import { apiGet } from "@/lib/api/client";
import {
  getApiBaseUrl,
  getApiKey,
  getApiSource,
} from "@/lib/api/env";
import { ApiError, type ApiEnvelope } from "@/lib/api/types";
import { mapStudentRegistrationForm } from "./mapper";
import type {
  RegistrationFormApi,
  StudentRegistrationFormViewModel,
} from "./types";

export async function getStudentRegistration(
  accessToken: string
): Promise<StudentRegistrationFormViewModel | null> {
  try {
    const data = await apiGet<RegistrationFormApi>(
      "api/website/student/registration",
      { accessToken, cache: "no-store" }
    );
    return mapStudentRegistrationForm(data ?? {});
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[getStudentRegistration]", error);
    }
    return null;
  }
}

export async function submitStudentRegistration(
  accessToken: string,
  formData: FormData
): Promise<unknown> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new ApiError("NEXT_PUBLIC_API_BASE_URL is not configured", 0);
  }

  const headers: HeadersInit = {
    Accept: "application/json",
    "x-source": getApiSource(),
    Authorization: `Bearer ${accessToken}`,
  };
  const apiKey = getApiKey();
  if (apiKey) headers["x-api-key"] = apiKey;

  const response = await fetch(
    `${baseUrl}api/website/student/registration`,
    {
      method: "POST",
      headers,
      body: formData,
      cache: "no-store",
    }
  );

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(
      "Invalid JSON from student registration",
      response.status
    );
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
      envelope?.message || "Registration submit failed",
      response.status,
      body
    );
  }

  return envelope.data;
}
