"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { DiscussionForumShell } from "@/components/sections/discussion-forum/DiscussionForumShell";
import { ForumMessageComposer } from "@/components/sections/discussion-forum/ForumMessageComposer";
import { isForumRichTextEmpty } from "@/components/sections/discussion-forum/ForumRichTextEditor";
import { Input } from "@/components/ui/Input";

type DiscussionForumAskProps = {
  basePath?: string;
};

export function DiscussionForumAsk({
  basePath = "/discussion-forum",
}: DiscussionForumAskProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  return (
    <DiscussionForumShell basePath={basePath} hideComposer>
      <Link
        href={basePath}
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
                  throw new Error("Title required");
                }
                if (isForumRichTextEmpty(html)) {
                  toast.error("Write some details before posting.");
                  throw new Error("Details required");
                }
                toast.success(
                  `Question captured${tags.trim() ? ` · tags: ${tags.trim()}` : ""} — API create comes after approval.`
                );
                router.push(basePath);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="q-tags"
              className="mb-1.5 block text-body-sm font-medium text-text-secondary"
            >
              Tags
            </label>
            <Input
              id="q-tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="quant, dilr, strategy (comma-separated)"
              className="h-10"
            />
          </div>

          <Link
            href={basePath}
            className="inline-flex items-center rounded-[6px] border border-border-default px-5 py-2.5 text-body-sm font-medium text-text-secondary transition-colors hover:border-orange-500/40 hover:text-orange-400"
          >
            Cancel
          </Link>
        </div>
      </div>
    </DiscussionForumShell>
  );
}
