import { NextResponse } from "next/server";

import {
  getGroupTopicMessages,
  postGroupMessage,
} from "@/lib/api/modules/groups/service";
import {
  toForumPreviewAnswer,
  toForumPreviewAnswers,
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
 * GET → `api/app/groups/messages` direct replies of one forum message
 * (`parent_message_id`). Used by the topic thread "Show replies" control.
 * Optional auth so `myReaction` is filled for logged-in viewers.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const groupId = asPositiveInt(url.searchParams.get("group_id"));
  const groupSlug = asTrimmedString(url.searchParams.get("group_slug"));
  const topicSlug = asTrimmedString(url.searchParams.get("topic_slug"));
  const parentMessageId = asPositiveInt(
    url.searchParams.get("parent_message_id")
  );
  const topicId = asPositiveInt(url.searchParams.get("topic_id"));

  if (!groupId || !groupSlug || !topicSlug || !parentMessageId) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "group_id, group_slug, topic_slug and parent_message_id are required.",
      },
      { status: 400 }
    );
  }

  const accessToken = await getAccessToken();
  const list = await getGroupTopicMessages({
    groupId,
    groupSlug,
    topicSlug,
    parentMessageId,
    sortOrder: "asc",
    page: 1,
    limit: 50,
    accessToken: accessToken ?? undefined,
  });

  if (!list) {
    return NextResponse.json(
      { ok: false, error: "Unable to load replies." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: toForumPreviewAnswers(list.items, topicId ?? 0),
  });
}

/**
 * POST multipart → `api/app/groups/messages`.
 * Forum reply: `group_id` + `topic_slug` (+ optional `parent_message_id` / `files`).
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

    if (!groupId || !topicSlug) {
      return NextResponse.json(
        { ok: false, error: "group_id and topic_slug are required." },
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
      topicSlug,
      content,
      parentMessageId,
      files,
    });

    if (forumSlug) {
      revalidateForumTopicPaths(forumSlug, topicSlug);
    }

    return NextResponse.json({
      ok: true,
      data: toForumPreviewAnswer(message, topicId ?? 0),
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
