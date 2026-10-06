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
  /** Bearer token for authenticated student APIs. */
  accessToken?: string;
  /** Force no-store (authenticated GETs). */
  cache?: RequestCache;
}

export interface ApiMutateOptions {
  signal?: AbortSignal;
  accessToken?: string;
}

function buildHeaders(options: {
  accessToken?: string;
  json?: boolean;
}): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-source": getApiSource(),
  };
  if (options.json) {
    headers["Content-Type"] = "application/json";
  }
  const apiKey = getApiKey();
  if (apiKey) {
    headers["x-api-key"] = apiKey;
  }
  if (options.accessToken) {
    headers.Authorization = `Bearer ${options.accessToken}`;
  }
  return headers;
}

async function parseEnvelope<T>(
  path: string,
  response: Response
): Promise<T> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ApiError(`Invalid JSON from ${path}`, response.status);
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

  const headers = buildHeaders({ accessToken: options.accessToken });
  const revalidate = options.revalidate ?? getApiRevalidateSeconds();
  const useNoStore =
    options.cache === "no-store" || Boolean(options.accessToken);

  const response = await fetch(url, {
    method: "GET",
    headers,
    signal: options.signal,
    ...(useNoStore
      ? { cache: "no-store" as const }
      : { next: { revalidate } }),
  });

  return parseEnvelope<T>(path, response);
}

export interface ApiPostOptions extends ApiMutateOptions {}

/**
 * Shared POST for public website APIs (contact / leads / auth).
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

  const response = await fetch(url, {
    method: "POST",
    headers: buildHeaders({
      accessToken: options.accessToken,
      json: true,
    }),
    body: JSON.stringify(body),
    signal: options.signal,
    cache: "no-store",
  });

  return parseEnvelope<TResponse>(path, response);
}

export async function apiPatch<TResponse, TBody>(
  path: string,
  body: TBody,
  options: ApiMutateOptions = {}
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

  const response = await fetch(url, {
    method: "PATCH",
    headers: buildHeaders({
      accessToken: options.accessToken,
      json: true,
    }),
    body: JSON.stringify(body),
    signal: options.signal,
    cache: "no-store",
  });

  return parseEnvelope<TResponse>(path, response);
}

export async function apiDelete<TResponse>(
  path: string,
  options: ApiMutateOptions = {}
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

  const response = await fetch(url, {
    method: "DELETE",
    headers: buildHeaders({ accessToken: options.accessToken }),
    signal: options.signal,
    cache: "no-store",
  });

  return parseEnvelope<TResponse>(path, response);
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
