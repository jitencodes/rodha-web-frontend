import { NextResponse } from "next/server";

import {
  reactToGroupMessage,
  removeGroupMessageReaction,
} from "@/lib/api/modules/groups/service";
import {
  toForumPreviewAnswer,
  toForumSpaceMessage,
} from "@/lib/api/modules/groups/ui";
import type {
  ForumMessageViewModel,
  ForumReactionType,
} from "@/lib/api/modules/groups/types";
import { ApiError } from "@/lib/api/types";
import { clearAuthCookie } from "@/lib/auth/session-cookie";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";
import { getAccessToken } from "@/lib/auth/server-session";
import { revalidateForumTopicPaths } from "@/lib/forum/revalidate";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ messageId: string }>;
};

type ReactionMeta = {
  topicSlug: string;
  forumSlug: string;
  topicId: number;
  groupId: number;
};

function parseMessageId(raw: string): number | null {
  const messageId = Number.parseInt(raw, 10);
  return Number.isFinite(messageId) && messageId > 0 ? messageId : null;
}

function parseReactionType(value: unknown): ForumReactionType | null {
  if (typeof value !== "string") return null;
  const key = value.trim().toLowerCase();
  if (key === "like" || key === "dislike") return key;
  return null;
}

function asPositiveInt(value: unknown): number {
  const raw =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number.parseInt(value, 10)
        : NaN;
  return Number.isFinite(raw) && raw > 0 ? raw : 0;
}

function parseMeta(body: Record<string, unknown> | null): ReactionMeta {
  const topicSlug =
    typeof body?.topic_slug === "string" ? body.topic_slug.trim() : "";
  const forumSlug =
    typeof body?.forum_slug === "string" ? body.forum_slug.trim() : topicSlug;
  return {
    topicSlug,
    forumSlug,
    topicId: asPositiveInt(body?.topic_id),
    groupId: asPositiveInt(body?.group_id),
  };
}

function reactionPayload(message: ForumMessageViewModel, meta: ReactionMeta) {
  if (meta.topicSlug) {
    return toForumPreviewAnswer(message, meta.topicId);
  }
  return toForumSpaceMessage(message, meta.groupId || 0);
}

function unauthorizedResponse(status: number) {
  const res = NextResponse.json(
    { ok: false, error: "Session expired" },
    { status }
  );
  clearAuthCookie(res);
  return res;
}

function errorResponse(error: unknown, fallback: string) {
  if (error instanceof ApiError && isUnauthorizedStatus(error.status)) {
    return unauthorizedResponse(error.status);
  }

  const message =
    error instanceof ApiError
      ? error.message
      : error instanceof Error
        ? error.message
        : fallback;

  return NextResponse.json(
    { ok: false, error: message },
    { status: error instanceof ApiError ? 502 : 400 }
  );
}

/** Add / change reaction. Body `{ reaction_type, topic_id?, topic_slug?, forum_slug?, group_id? }`. */
export async function POST(request: Request, context: RouteContext) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Log in to react." },
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
    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;

    const reactionType = parseReactionType(body?.reaction_type);
    if (!reactionType) {
      return NextResponse.json(
        { ok: false, error: "reaction_type must be like or dislike." },
        { status: 400 }
      );
    }

    const meta = parseMeta(body);
    const result = await reactToGroupMessage(accessToken, {
      messageId,
      reactionType,
    });

    if (!result.message) {
      return NextResponse.json(
        { ok: false, error: "Reaction updated but response was empty." },
        { status: 502 }
      );
    }

    if (meta.forumSlug && meta.topicSlug) {
      revalidateForumTopicPaths(meta.forumSlug, meta.topicSlug);
    }

    return NextResponse.json({
      ok: true,
      action: result.action,
      data: reactionPayload(result.message, meta),
    });
  } catch (error) {
    return errorResponse(error, "Unable to update reaction");
  }
}

/**
 * Remove the current user's reaction.
 * `DELETE api/app/groups/messages/:messageId/reactions`
 * Optional JSON body: `{ topic_id?, topic_slug?, forum_slug?, group_id? }` for response shape / revalidate.
 */
export async function DELETE(request: Request, context: RouteContext) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Log in to remove a reaction." },
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
    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    const meta = parseMeta(body);

    const result = await removeGroupMessageReaction(accessToken, messageId);

    if (meta.forumSlug && meta.topicSlug) {
      revalidateForumTopicPaths(meta.forumSlug, meta.topicSlug);
    }

    return NextResponse.json({
      ok: true,
      action: result.action || "removed",
      data: result.message ? reactionPayload(result.message, meta) : null,
    });
  } catch (error) {
    return errorResponse(error, "Unable to remove reaction");
  }
}
