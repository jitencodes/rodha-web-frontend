"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ForumMessageComposer } from "@/components/sections/discussion-forum/ForumMessageComposer";
import { isForumRichTextEmpty } from "@/components/sections/discussion-forum/ForumRichTextEditor";
import { Input } from "@/components/ui/Input";
import type { ForumPreviewQuestion } from "@/data/discussion-forum";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { forumTopicPath } from "@/lib/forum/paths";

export type ForumAskGroupOption = { id: number; name: string; slug: string };

type DiscussionForumAskProps = {
  /** Groups the user can post in. One entry = fixed group (no picker). */
  groups: ForumAskGroupOption[];
  initialGroupId?: number;
  /** Where Cancel goes. */
  cancelHref: string;
};

/**
 * Create Topic form — `POST api/app/groups/:groupRef/topics` via
 * `/api/discussion-forum/topics`. Fields match the API: title + content only
 * (no image upload until the backend supports it).
 */
export function DiscussionForumAsk({
  groups,
  initialGroupId,
  cancelHref,
}: DiscussionForumAskProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [groupId, setGroupId] = useState<number | "">(
    initialGroupId ?? (groups.length === 1 ? groups[0].id : "")
  );
  const selectedGroup = groups.find((group) => group.id === groupId) ?? null;
  const showPicker = groups.length > 1;

  return (
    <div className="rounded-xl border border-orange-100 bg-white p-4 shadow-sm sm:p-6">
      <h1 className="text-h3 font-bold tracking-tight text-neutral-900">Create a topic</h1>
      <p className="mt-1 text-body-sm text-neutral-600">
        {selectedGroup && !showPicker
          ? `Posting in ${selectedGroup.name}. Ask clearly so mentors and peers can help faster.`
          : "Ask clearly so mentors and peers can help faster."}
      </p>

      <div className="mt-6 space-y-4">
        {showPicker ? (
          <div>
            <label
              htmlFor="topic-group"
              className="mb-1.5 block text-body-sm font-medium text-neutral-700"
            >
              Group
            </label>
            <select
              id="topic-group"
              value={groupId}
              onChange={(event) =>
                setGroupId(event.target.value ? Number(event.target.value) : "")
              }
              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-body-sm text-neutral-900 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Select a group…</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <div>
          <label
            htmlFor="topic-title"
            className="mb-1.5 block text-body-sm font-medium text-neutral-700"
          >
            Title
          </label>
          <Input
            id="topic-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Be specific, e.g. How to solve train crossing TSD problems?"
            variant="light"
            className="h-10"
          />
        </div>

        <div>
          <p className="mb-1.5 block text-body-sm font-medium text-neutral-700">Details</p>
          <ForumMessageComposer
            placeholder="Write your question details..."
            submitLabel="Post Topic"
            onSubmit={async ({ html }) => {
              if (!selectedGroup) {
                toast.error("Choose a group for your topic.");
                throw new Error("Choose a group for your topic.");
              }
              if (!title.trim()) {
                toast.error("Title is required.");
                throw new Error("Title is required.");
              }
              if (isForumRichTextEmpty(html)) {
                toast.error("Write some details before posting.");
                throw new Error("Write some details before posting.");
              }

              const response = await fetchAuthed("/api/discussion-forum/topics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  groupId: selectedGroup.id,
                  title: title.trim(),
                  content: html.trim(),
                  forum_slug: selectedGroup.slug,
                }),
              });

              const body = (await response.json().catch(() => null)) as {
                ok?: boolean;
                error?: string;
                data?: ForumPreviewQuestion;
              } | null;

              if (!response.ok || !body?.ok || !body.data?.slug) {
                throw new Error(body?.error || "Unable to create topic.");
              }

              toast.success("Topic posted.");
              router.push(forumTopicPath(selectedGroup.slug, body.data.slug));
              router.refresh();
            }}
          />
        </div>

        <Link
          href={cancelHref}
          prefetch={false}
          className="inline-flex items-center rounded-[6px] border border-neutral-300 bg-white px-5 py-2.5 text-body-sm font-medium text-neutral-700 transition-colors hover:border-orange-400 hover:text-orange-600"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
