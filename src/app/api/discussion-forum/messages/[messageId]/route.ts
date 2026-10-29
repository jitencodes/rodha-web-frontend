import { NextResponse } from "next/server";

import {
  deleteGroupMessage,
  updateGroupMessage,
} from "@/lib/api/modules/groups/service";
import { toForumPreviewAnswer } from "@/lib/api/modules/groups/ui";
import { ApiError } from "@/lib/api/types";
import { clearAuthCookie } from "@/lib/auth/session-cookie";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";
import { getAccessToken } from "@/lib/auth/server-session";
import { revalidateForumTopicPaths } from "@/lib/forum/revalidate";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ messageId: string }>;
};

function parseMessageId(raw: string): number | null {
  const messageId = Number.parseInt(raw, 10);
  return Number.isFinite(messageId) && messageId > 0 ? messageId : null;
}

export async function PATCH(request: Request, context: RouteContext) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Log in to edit an answer." },
      { status: 401 }
    );
  }

  const { messageId: messageIdRaw } = await context.params;
  const messageId = parseMessageId(messageIdRaw);
  if (!messageId) {
    return NextResponse.json(
      { ok: false, error: "Invalid message id." },
      { status: 400 }
    );
  }

  try {
    const body = (await request.json().catch(() => null)) as {
      content?: unknown;
      topic_id?: unknown;
      topic_slug?: unknown;
      forum_slug?: unknown;
    } | null;

    const content =
      typeof body?.content === "string" ? body.content.trim() : "";
    const topicSlug =
      typeof body?.topic_slug === "string" ? body.topic_slug.trim() : "";
    const forumSlug =
      typeof body?.forum_slug === "string" ? body.forum_slug.trim() : topicSlug;
    const topicIdRaw =
      typeof body?.topic_id === "number"
        ? body.topic_id
        : typeof body?.topic_id === "string"
          ? Number.parseInt(body.topic_id, 10)
          : NaN;
    const topicId =
      Number.isFinite(topicIdRaw) && topicIdRaw > 0 ? topicIdRaw : 0;

    if (!content) {
      return NextResponse.json(
        { ok: false, error: "Write an answer before saving." },
        { status: 400 }
      );
    }

    const message = await updateGroupMessage(accessToken, {
      messageId,
      content,
    });

    if (forumSlug && topicSlug) {
      revalidateForumTopicPaths(forumSlug, topicSlug);
    }

    return NextResponse.json({
      ok: true,
      data: toForumPreviewAnswer(message, topicId),
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
          : "Unable to edit answer";

    return NextResponse.json(
      { ok: false, error: message },
      { status: error instanceof ApiError ? 502 : 400 }
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Log in to delete an answer." },
      { status: 401 }
    );
  }

  const { messageId: messageIdRaw } = await context.params;
  const messageId = parseMessageId(messageIdRaw);
  if (!messageId) {
    return NextResponse.json(
      { ok: false, error: "Invalid message id." },
      { status: 400 }
    );
  }

  try {
    const url = new URL(request.url);
    const forumSlug = url.searchParams.get("forum_slug")?.trim() || "";
    const topicSlug = url.searchParams.get("topic_slug")?.trim() || "";

    await deleteGroupMessage(accessToken, messageId);

    if (forumSlug && topicSlug) {
      revalidateForumTopicPaths(forumSlug, topicSlug);
    }

    return NextResponse.json({ ok: true });
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
          : "Unable to delete answer";

    return NextResponse.json(
      { ok: false, error: message },
      { status: error instanceof ApiError ? 502 : 400 }
    );
  }
}
