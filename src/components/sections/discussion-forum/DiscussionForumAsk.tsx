"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn } from "lucide-react";
import { toast } from "sonner";

import {
  DiscussionForumShell,
  type DiscussionForumHero,
} from "@/components/sections/discussion-forum/DiscussionForumShell";
import { ForumMessageComposer } from "@/components/sections/discussion-forum/ForumMessageComposer";
import { isForumRichTextEmpty } from "@/components/sections/discussion-forum/ForumRichTextEditor";
import { Input } from "@/components/ui/Input";
import type { ForumPreviewQuestion } from "@/data/discussion-forum";
import { fetchAuthed } from "@/lib/auth/session-expired";

type DiscussionForumAskProps = {
  basePath?: string;
  forum?: DiscussionForumHero;
  questions?: ForumPreviewQuestion[];
  groupId: number;
  forumSlug: string;
  canAsk: boolean;
  loginHref: string;
};

export function DiscussionForumAsk({
  basePath = "/discussion-forum",
  forum,
  questions,
  groupId,
  forumSlug,
  canAsk,
  loginHref,
}: DiscussionForumAskProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");

  return (
    <DiscussionForumShell
      basePath={basePath}
      forum={forum}
      questions={questions}
      hideComposer
    >
      <Link
        href={basePath}
        prefetch={false}
        className="mb-3 inline-flex h-9 items-center gap-1.5 px-1 text-body-sm text-text-muted transition-colors hover:text-orange-400"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to feed
      </Link>

      <div className="rounded-2xl border border-border-default bg-bg-surface p-5 sm:p-6">
        <h2 className="text-h3 font-semibold tracking-tight text-text-primary">
          Start a discussion
        </h2>
        <p className="mt-1 text-body-sm text-text-muted">
          Ask clearly so mentors and peers can help faster.
        </p>

        {canAsk ? (
          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="q-title"
                className="mb-1.5 block text-body-sm font-medium text-text-secondary"
              >
                Title
              </label>
              <Input
                id="q-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Be specific — e.g. How to solve train crossing TSD problems?"
                className="h-10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-body-sm font-medium text-text-secondary">
                Details
              </label>
              <ForumMessageComposer
                placeholder="Write your question details..."
                submitLabel="Post Question"
                onSubmit={async ({ html }) => {
                  if (!title.trim()) {
                    toast.error("Title is required.");
                    throw new Error("Title is required.");
                  }
                  if (isForumRichTextEmpty(html)) {
                    toast.error("Write some details before posting.");
                    throw new Error("Write some details before posting.");
                  }

                  const response = await fetchAuthed(
                    "/api/discussion-forum/topics",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        groupId,
                        title: title.trim(),
                        content: html.trim(),
                        forum_slug: forumSlug,
                      }),
                    }
                  );

                  const body = (await response.json().catch(() => null)) as {
                    ok?: boolean;
                    error?: string;
                    data?: ForumPreviewQuestion;
                  } | null;

                  if (!response.ok || !body?.ok || !body.data?.slug) {
                    throw new Error(body?.error || "Unable to create question.");
                  }

                  toast.success("Question posted.");
                  router.push(
                    `${basePath}/${encodeURIComponent(body.data.slug)}`
                  );
                  router.refresh();
                }}
              />
            </div>

            <Link
              href={basePath}
              prefetch={false}
              className="inline-flex items-center rounded-[6px] border border-border-default px-5 py-2.5 text-body-sm font-medium text-text-secondary transition-colors hover:border-orange-500/40 hover:text-orange-400"
            >
              Cancel
            </Link>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-border-default bg-bg-tertiary/40 px-4 py-5 text-center sm:px-6">
            <p className="text-body-sm text-text-muted">
              Log in to ask a question in this forum.
            </p>
            <Link
              href={loginHref}
              className="btn-primary mt-3 inline-flex items-center gap-2 rounded-[6px] px-3.5 py-2 text-body-sm font-semibold"
            >
              <LogIn className="size-4" aria-hidden />
              Log in to ask
            </Link>
          </div>
        )}
      </div>
    </DiscussionForumShell>
  );
}
