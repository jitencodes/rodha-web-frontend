import {
  getApiBaseUrl,
  getApiKey,
  getApiRevalidateSeconds,
  getApiSource,
} from "@/lib/api/env";
import { ApiError, type ApiEnvelope } from "@/lib/api/types";

export interface ApiGetOptions {
  /** Override default revalidate (seconds). */
  revalidate?: number;
  /** Abort / extra fetch init. */
  signal?: AbortSignal;
}

/**
 * Shared GET for public website APIs.
 * Unwraps `{ success, message, data }` and returns `data`.
 */
export async function apiGet<T>(
  path: string,
  options: ApiGetOptions = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new ApiError(
      "NEXT_PUBLIC_API_BASE_URL is not configured",
      0
    );
  }

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = `${baseUrl}${normalizedPath}`;

  const headers: HeadersInit = {
    Accept: "application/json",
    "x-source": getApiSource(),
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const revalidate = options.revalidate ?? getApiRevalidateSeconds();

  const response = await fetch(url, {
    method: "GET",
    headers,
    signal: options.signal,
    next: { revalidate },
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(
      `Invalid JSON from ${path}`,
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

  const envelope = body as ApiEnvelope<T>;
  if (!envelope || envelope.success !== true) {
    throw new ApiError(
      envelope?.message || `API returned unsuccessful response for ${path}`,
      response.status,
      body
    );
  }

  return envelope.data;
}

export interface ApiPostOptions {
  signal?: AbortSignal;
}

/**
 * Shared POST for public website APIs (contact / leads).
 * Unwraps `{ success, message, data }` and returns `data`.
 */
export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
  options: ApiPostOptions = {}
): Promise<TResponse> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    throw new ApiError(
      "NEXT_PUBLIC_API_BASE_URL is not configured",
      0
    );
  }

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = `${baseUrl}${normalizedPath}`;

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "x-source": getApiSource(),
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: options.signal,
    cache: "no-store",
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError(`Invalid JSON from ${path}`, response.status);
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof (payload as { message: unknown }).message === "string"
        ? (payload as { message: string }).message
        : `Request failed: ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  const envelope = payload as ApiEnvelope<TResponse>;
  if (!envelope || envelope.success !== true) {
    throw new ApiError(
      envelope?.message || `API returned unsuccessful response for ${path}`,
      response.status,
      payload
    );
  }

  return envelope.data;
}

/**
 * Soft-fail wrapper for layout/page loads — returns null on any error
 * so empty UI can hide instead of crashing SSR.
 */
export async function apiGetOrNull<T>(
  path: string,
  options?: ApiGetOptions
): Promise<T | null> {
  if (!getApiBaseUrl()) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[apiGetOrNull] ${path}: NEXT_PUBLIC_API_BASE_URL is not configured`
      );
    }
    return null;
  }

  try {
    return await apiGet<T>(path, options);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[apiGetOrNull] ${path}`, error);
    }
    return null;
  }
}
