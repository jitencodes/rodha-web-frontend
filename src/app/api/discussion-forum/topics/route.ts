import { NextResponse } from "next/server";

import { createGroupTopic } from "@/lib/api/modules/groups/service";
import { toForumPreviewQuestion } from "@/lib/api/modules/groups/ui";
import { ApiError } from "@/lib/api/types";
import { clearAuthCookie } from "@/lib/auth/session-cookie";
import { isUnauthorizedStatus } from "@/lib/auth/session-expired";
import { getAccessToken } from "@/lib/auth/server-session";
import {
  revalidateForumFeedPath,
  revalidateForumTopicPaths,
} from "@/lib/forum/revalidate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { ok: false, error: "Log in to ask a question." },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json().catch(() => null)) as {
      groupId?: unknown;
      title?: unknown;
      content?: unknown;
      forum_slug?: unknown;
    } | null;

    const groupIdRaw =
      typeof body?.groupId === "number"
        ? body.groupId
        : typeof body?.groupId === "string"
          ? Number.parseInt(body.groupId, 10)
          : NaN;
    const groupId =
      Number.isFinite(groupIdRaw) && groupIdRaw > 0 ? groupIdRaw : 0;
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const content =
      typeof body?.content === "string" ? body.content.trim() : "";
    const forumSlug =
      typeof body?.forum_slug === "string" ? body.forum_slug.trim() : "";

    if (!groupId) {
      return NextResponse.json(
        { ok: false, error: "groupId is required." },
        { status: 400 }
      );
    }
    if (!title) {
      return NextResponse.json(
        { ok: false, error: "Title is required." },
        { status: 400 }
      );
    }
    if (!content) {
      return NextResponse.json(
        { ok: false, error: "Write some details before posting." },
        { status: 400 }
      );
    }

    const topic = await createGroupTopic(accessToken, {
      groupId,
      title,
      content,
    });

    if (forumSlug) {
      revalidateForumFeedPath(forumSlug);
      revalidateForumTopicPaths(forumSlug, topic.slug);
    }

    return NextResponse.json({
      ok: true,
      data: toForumPreviewQuestion(topic),
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
          : "Unable to create question";

    return NextResponse.json(
      { ok: false, error: message },
      { status: error instanceof ApiError ? 502 : 400 }
    );
  }
}
