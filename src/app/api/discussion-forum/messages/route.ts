import { NextResponse } from "next/server";

import { postGroupMessage } from "@/lib/api/modules/groups/service";
import {
  toForumPreviewAnswer,
  toForumSpaceMessage,
} from "@/lib/api/modules/groups/ui";
import { ApiError } from "@/lib/api/types";
import { clearAuthCookie } from "@/lib/auth/session-cookie";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";
import { getAccessToken } from "@/lib/auth/server-session";
import { revalidateForumTopicPaths } from "@/lib/forum/revalidate";

export const runtime = "nodejs";

function asPositiveInt(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string") return null;
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function asTrimmedString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * POST multipart → `api/app/groups/messages`.
 * - Forum answer: `group_id` + `topic_slug` (+ optional parent / files)
 * - Group chat: `group_id` + `content` / `files` (no topic_slug)
 */
export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Log in to send a message." },
      { status: 401 }
    );
  }

  try {
    const form = await request.formData();
    const groupId = asPositiveInt(form.get("group_id"));
    const topicSlug = asTrimmedString(form.get("topic_slug"));
    const forumSlug = asTrimmedString(form.get("forum_slug"));
    const content = asTrimmedString(form.get("content"));
    const parentMessageId = asPositiveInt(form.get("parent_message_id"));
    const topicId = asPositiveInt(form.get("topic_id"));

    const files = form
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!groupId) {
      return NextResponse.json(
        { ok: false, error: "group_id is required." },
        { status: 400 }
      );
    }

    if (!content && files.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Write a message before posting." },
        { status: 400 }
      );
    }

    const message = await postGroupMessage(accessToken, {
      groupId,
      topicSlug: topicSlug || null,
      content,
      parentMessageId: topicSlug ? parentMessageId : null,
      files,
    });

    if (forumSlug && topicSlug) {
      revalidateForumTopicPaths(forumSlug, topicSlug);
    }

    if (topicSlug) {
      return NextResponse.json({
        ok: true,
        data: toForumPreviewAnswer(message, topicId ?? 0),
      });
    }

    return NextResponse.json({
      ok: true,
      data: toForumSpaceMessage(message, groupId),
    });
  } catch (error) {
    if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
      const res = NextResponse.json(
        { ok: false, error: "Session expired" },
        { status: error.status }
      );
      clearAuthCookie(res);
      return res;
    }

    const message =
      error instanceof ApiError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Unable to send message";

    return NextResponse.json(
      { ok: false, error: message },
      { status: error instanceof ApiError ? 502 : 400 }
    );
  }
}
