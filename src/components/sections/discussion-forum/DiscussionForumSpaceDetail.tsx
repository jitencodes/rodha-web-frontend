"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  Reply,
  Search,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { ForumAvatar } from "@/components/sections/discussion-forum/ForumAvatar";
import {
  DiscussionForumShell,
  type DiscussionForumHero,
} from "@/components/sections/discussion-forum/DiscussionForumShell";
import { ForumMessageComposer } from "@/components/sections/discussion-forum/ForumMessageComposer";
import { isForumRichTextEmpty } from "@/components/sections/discussion-forum/ForumRichTextEditor";
import { Input } from "@/components/ui/Input";
import {
  FORUM_SPACE_MEMBERS,
  FORUM_SPACE_MESSAGES,
  formatForumCount,
  formatForumRelativeTime,
  type ForumPreviewQuestion,
  type ForumSpaceItem,
  type ForumSpaceMessage,
} from "@/data/discussion-forum";
import { cn } from "@/lib/utils";

type DiscussionForumSpaceDetailProps = {
  space: ForumSpaceItem;
  kind: "groups" | "channels";
  basePath?: string;
  forum?: DiscussionForumHero;
  questions?: ForumPreviewQuestion[];
};

type ReactionState = Record<number, { like: number; dislike: number; mine: "like" | "dislike" | null }>;

/** Student chat: view + reply + react. No edit / delete. */
export function DiscussionForumSpaceDetail({
  space,
  kind,
  basePath = "/discussion-forum",
  forum,
  questions,
}: DiscussionForumSpaceDetailProps) {
  const listHref = `${basePath}/${kind}`;
  const members = FORUM_SPACE_MEMBERS[space.id] ?? [];
  const initialMessages = FORUM_SPACE_MESSAGES[space.id] ?? [];

  const [messages, setMessages] = useState<ForumSpaceMessage[]>(initialMessages);
  const [memberQuery, setMemberQuery] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [reactions, setReactions] = useState<ReactionState>(() =>
    Object.fromEntries(
      initialMessages.map((message) => [
        message.id,
        {
          like: message.reactionTypeCount.like,
          dislike: message.reactionTypeCount.dislike,
          mine: null as "like" | "dislike" | null,
        },
      ])
    )
  );

  const filteredMembers = useMemo(() => {
    const q = memberQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (member) =>
        member.fullName.toLowerCase().includes(q) ||
        member.email?.toLowerCase().includes(q)
    );
  }, [members, memberQuery]);

  const replyTarget = messages.find((message) => message.id === replyToId) ?? null;

  const toggleReaction = (messageId: number, type: "like" | "dislike") => {
    setReactions((prev) => {
      const current = prev[messageId] ?? { like: 0, dislike: 0, mine: null };
      const next = { ...current };
      if (current.mine === type) {
        next[type] = Math.max(0, current[type] - 1);
        next.mine = null;
      } else {
        if (current.mine) next[current.mine] = Math.max(0, current[current.mine] - 1);
        next[type] = current[type] + 1;
        next.mine = type;
      }
      return { ...prev, [messageId]: next };
    });
  };

  return (
    <DiscussionForumShell
      basePath={basePath}
      forum={forum}
      questions={questions}
      hideComposer
    >
      <Link
        href={listHref}
        className="mb-3 inline-flex h-9 items-center gap-1.5 px-1 text-body-sm text-text-muted transition-colors hover:text-orange-400"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to {kind}
      </Link>

      <div className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-2xl border border-border-default bg-bg-surface p-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-h4 font-semibold text-text-primary">{space.name}</h2>
              <span className="rounded-full border border-border-default px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-dimmed">
                {kind === "groups" ? "Group" : "Channel"}
              </span>
            </div>
            <p className="mt-1.5 text-body-sm text-text-muted">{space.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-orange-500/10 p-2.5">
              <Users className="mb-1 size-3.5 text-orange-400" aria-hidden />
              <p className="text-body font-semibold text-text-primary">
                {formatForumCount(space.memberCount)}
              </p>
              <p className="text-[11px] text-text-dimmed">Members</p>
            </div>
            <div className="rounded-lg bg-orange-500/10 p-2.5">
              <MessageSquare className="mb-1 size-3.5 text-orange-400" aria-hidden />
              <p className="text-body font-semibold text-text-primary">{messages.length}</p>
              <p className="text-[11px] text-text-dimmed">Messages</p>
            </div>
            <div className="rounded-lg bg-orange-500/10 p-2.5">
              <p className="text-[9px] font-semibold text-text-primary ">
                {new Date(space.lastActiveAt).toLocaleDateString("en-IN")}
              </p>
              <p className="mt-3 text-[11px] text-text-dimmed">Activity</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-body-sm font-semibold text-text-primary">Members</p>
            <div className="relative mb-2">
              <Search
                className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-text-dimmed"
                aria-hidden
              />
              <Input
                value={memberQuery}
                onChange={(event) => setMemberQuery(event.target.value)}
                placeholder="Search members…"
                className="h-9 rounded-lg pl-8 text-body-sm"
              />
            </div>
            <ul className="max-h-56 space-y-2 overflow-y-auto">
              {filteredMembers.map((member) => (
                <li key={member.id} className="flex items-center gap-2.5">
                  <ForumAvatar
                    name={member.fullName}
                    className="size-8"
                    textClassName="text-[10px]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-body-sm font-medium text-text-primary">
                      {member.fullName}
                    </p>
                    <p className="truncate text-caption text-text-dimmed">
                      {member.role}
                      {member.email ? ` · ${member.email}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-border-default bg-bg-surface">
          <div className="flex items-center justify-between gap-2 border-b border-border-subtle px-4 py-3">
            <div>
              <p className="text-body-sm font-semibold text-text-primary">
                {kind === "groups" ? "Group Messages" : "Channel Messages"}
              </p>
              <p className="text-caption text-text-dimmed">
                {messages.length} messages loaded · reply & react only
              </p>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length ? (
              messages.map((message) => {
                const reaction = reactions[message.id] ?? {
                  like: message.reactionTypeCount.like,
                  dislike: message.reactionTypeCount.dislike,
                  mine: null,
                };
                return (
                  <article
                    key={message.id}
                    className="rounded-xl border border-border-subtle bg-bg-tertiary/50 p-3.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <ForumAvatar
                        name={message.author.fullName}
                        className="size-8"
                        textClassName="text-[10px]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-body-sm font-semibold text-text-primary">
                            {message.author.fullName}
                          </p>
                          <p className="text-caption text-text-dimmed">
                            {formatForumRelativeTime(message.createdAt)}
                          </p>
                        </div>
                        <div
                          className="mt-2 space-y-2 text-body-sm leading-relaxed text-text-secondary [&_p]:mb-1"
                          dangerouslySetInnerHTML={{ __html: message.content }}
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleReaction(message.id, "like")}
                            className={cn(
                              "inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption transition-colors",
                              reaction.mine === "like"
                                ? "bg-orange-500/15 text-orange-400"
                                : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
                            )}
                            aria-label="Like"
                          >
                            <ThumbsUp className="size-3.5" />
                            {reaction.like}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleReaction(message.id, "dislike")}
                            className={cn(
                              "inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption transition-colors",
                              reaction.mine === "dislike"
                                ? "bg-accent-red/15 text-accent-red"
                                : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
                            )}
                            aria-label="Dislike"
                          >
                            <ThumbsDown className="size-3.5" />
                            {reaction.dislike}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setReplyToId((current) =>
                                current === message.id ? null : message.id
                              )
                            }
                            className={cn(
                              "inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption transition-colors",
                              replyToId === message.id
                                ? "bg-orange-500/15 text-orange-400"
                                : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
                            )}
                          >
                            <Reply className="size-3.5" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="py-12 text-center text-body-sm text-text-muted">
                No messages yet. Be the first to reply.
              </p>
            )}
          </div>

          <div className="border-t border-border-subtle p-3">
            {replyTarget ? (
              <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-orange-500/25 bg-orange-500/10 px-3 py-2 text-caption text-orange-400">
                <span className="truncate">
                  Replying to <strong>{replyTarget.author.fullName}</strong>
                </span>
                <button
                  type="button"
                  className="shrink-0 underline-offset-2 hover:underline"
                  onClick={() => setReplyToId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : null}
            <ForumMessageComposer
              placeholder="Write a message..."
              submitLabel="Send"
              onSubmit={async ({ html }) => {
                if (isForumRichTextEmpty(html)) {
                  toast.error("Write a message before sending.");
                  throw new Error("Empty");
                }
                const next: ForumSpaceMessage = {
                  id: Date.now(),
                  spaceId: space.id,
                  content: html,
                  createdAt: new Date().toISOString(),
                  author: {
                    id: "you",
                    fullName: "You",
                    profilePicturePath: null,
                    reputation: 0,
                  },
                  reactionTypeCount: { like: 0, dislike: 0 },
                  parentMessageId: replyToId,
                };
                setMessages((prev) => [...prev, next]);
                setReactions((prev) => ({
                  ...prev,
                  [next.id]: { like: 0, dislike: 0, mine: null },
                }));
                setReplyToId(null);
                toast.success("Message sent (preview).");
              }}
            />
          </div>
        </div>
      </div>
    </DiscussionForumShell>
  );
}
