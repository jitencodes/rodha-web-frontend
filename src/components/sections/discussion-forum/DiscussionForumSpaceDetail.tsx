"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  FileText,
  MessageSquare,
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
import { useGroupChatRealtime } from "@/hooks/useGroupChatRealtime";
import {
  FORUM_SPACE_MEMBERS,
  FORUM_SPACE_MESSAGES,
  formatForumCount,
  type ForumPreviewAttachment,
  type ForumPreviewQuestion,
  type ForumSpaceItem,
  type ForumSpaceMember,
  type ForumSpaceMessage,
} from "@/data/discussion-forum";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { cn } from "@/lib/utils";

type DiscussionForumSpaceDetailProps = {
  space: ForumSpaceItem;
  kind: "groups" | "channels";
  basePath?: string;
  forum?: DiscussionForumHero;
  questions?: ForumPreviewQuestion[];
  /** When set (channels), use API messages. Groups may omit and use preview mock. */
  messages?: ForumSpaceMessage[];
  /** Channel/group roster from API; falls back to preview mock when omitted. */
  members?: ForumSpaceMember[];
  /** Logged-in user id — own messages align right. */
  currentUserId?: string | null;
  /** From membership check — archived groups are read-only. */
  initiallyArchived?: boolean;
};

type ReactionState = Record<
  number,
  { like: number; dislike: number; mine: "like" | "dislike" | null }
>;

function SpaceMessageAttachments({
  attachments,
  align = "start",
}: {
  attachments: ForumPreviewAttachment[];
  align?: "start" | "end";
}) {
  if (!attachments.length) return null;

  const images = attachments.filter((item) => item.isImage);
  const files = attachments.filter((item) => !item.isImage);

  return (
    <div className={cn("mt-2 space-y-2", align === "end" && "items-end")}>
      {images.length ? (
        <ul
          className={cn(
            "flex flex-wrap gap-2",
            align === "end" && "justify-end"
          )}
        >
          {images.map((attachment) => (
            <li key={attachment.id} className="max-w-[14rem] sm:max-w-[16rem]">
              <a
                href={attachment.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-xl border border-border-default bg-bg-tertiary"
              >
                {/* Native img: attachment hosts vary (S3 / CDN). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachment.filePath}
                  alt={attachment.fileName}
                  className="max-h-56 w-full object-cover"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {files.length ? (
        <ul className={cn("space-y-1.5", align === "end" && "flex flex-col items-end")}>
          {files.map((attachment) => (
            <li key={attachment.id}>
              <a
                href={attachment.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-caption text-text-secondary transition-colors hover:border-orange-500/40 hover:text-orange-400"
              >
                <FileText className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{attachment.fileName}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function chronologicalMessages(
  messages: ForumSpaceMessage[]
): ForumSpaceMessage[] {
  return [...messages].sort((a, b) => {
    const aTime = Date.parse(a.createdAt);
    const bTime = Date.parse(b.createdAt);
    if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) {
      return aTime - bTime;
    }
    return a.id - b.id;
  });
}

function activityLabel(lastActiveAt: string): string {
  if (!lastActiveAt) return "—";
  const date = new Date(lastActiveAt);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB");
}

function formatChatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function roleBadgeClass(role: string): string {
  const key = role.trim().toLowerCase();
  if (key.includes("admin")) {
    return "border-orange-500/30 bg-orange-500/10 text-orange-400";
  }
  if (key.includes("mentor") || key.includes("moderator")) {
    return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  }
  return "border-border-default bg-bg-tertiary text-text-muted";
}

function hasVisibleContent(html: string): boolean {
  return !isForumRichTextEmpty(html);
}

function looksLikeHtml(value: string): boolean {
  return /<[a-z][\s\S]*>/i.test(value);
}

/** Groups + channels detail: sidebar stats/members + chat bubbles. */
export function DiscussionForumSpaceDetail({
  space,
  kind,
  basePath = "/discussion-forum",
  forum,
  questions,
  messages: messagesProp,
  members: membersProp,
  currentUserId = null,
  initiallyArchived = false,
}: DiscussionForumSpaceDetailProps) {
  const router = useRouter();
  const listHref = `${basePath}/${kind}`;
  const viewOnly = kind === "channels";
  const isGroupChat = kind === "groups";
  const members = membersProp ?? FORUM_SPACE_MEMBERS[space.id] ?? [];
  const memberCount = membersProp ? members.length : space.memberCount;
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const closedRef = useRef(false);

  const resolveMessages = (): ForumSpaceMessage[] => {
    const source = messagesProp
      ? messagesProp
      : viewOnly
        ? []
        : (FORUM_SPACE_MESSAGES[space.id] ?? []);
    return isGroupChat ? chronologicalMessages(source) : source;
  };

  const [messages, setMessages] = useState<ForumSpaceMessage[]>(resolveMessages);
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const [readOnly, setReadOnly] = useState(initiallyArchived);
  const [memberQuery, setMemberQuery] = useState("");
  const [reactingMessageId, setReactingMessageId] = useState<number | null>(
    null
  );
  const [reactions, setReactions] = useState<ReactionState>(() =>
    Object.fromEntries(
      resolveMessages().map((message) => [
        message.id,
        {
          like: message.reactionTypeCount.like,
          dislike: message.reactionTypeCount.dislike,
          mine: message.myReaction ?? null,
        },
      ])
    )
  );

  useEffect(() => {
    const next = resolveMessages();
    const current = messagesRef.current;
    const known = new Set(next.map((message) => message.id));
    const extras = isGroupChat
      ? current.filter(
          (message) => message.spaceId === space.id && !known.has(message.id)
        )
      : [];
    const merged = extras.length
      ? chronologicalMessages([...next, ...extras])
      : next;

    setMessages(merged);
    setReactions((prev) =>
      Object.fromEntries(
        merged.map((message) => {
          const keptLocally = extras.some((item) => item.id === message.id);
          const local = prev[message.id];
          return [
            message.id,
            {
              like: message.reactionTypeCount.like,
              dislike: message.reactionTypeCount.dislike,
              mine: keptLocally
                ? (local?.mine ?? message.myReaction ?? null)
                : (message.myReaction ?? null),
            },
          ];
        })
      )
    );
    // Sync when server passes a new message list or the open space changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resolve from props intentionally
  }, [messagesProp, viewOnly, space.id, isGroupChat]);

  useEffect(() => {
    setReadOnly(initiallyArchived);
    closedRef.current = false;
    stickToBottomRef.current = true;
  }, [space.id, initiallyArchived]);

  const handleNewMessage = useCallback((message: ForumSpaceMessage) => {
    setMessages((list) =>
      list.some((item) => item.id === message.id) ? list : [...list, message]
    );
    setReactions((prev) => {
      if (prev[message.id]) return prev;
      return {
        ...prev,
        [message.id]: {
          like: message.reactionTypeCount.like,
          dislike: message.reactionTypeCount.dislike,
          mine: message.myReaction ?? null,
        },
      };
    });
  }, []);

  const handleReplacedMessage = useCallback((message: ForumSpaceMessage) => {
    setMessages((list) => {
      const existing = list.find((item) => item.id === message.id);
      if (!existing) return list;
      return list.map((item) =>
        item.id === message.id
          ? { ...message, myReaction: item.myReaction ?? null }
          : item
      );
    });
    setReactions((prev) => {
      const current = prev[message.id];
      if (!current) return prev;
      return {
        ...prev,
        [message.id]: {
          like: message.reactionTypeCount.like,
          dislike: message.reactionTypeCount.dislike,
          mine: current.mine,
        },
      };
    });
  }, []);

  const handleDeletedMessage = useCallback((messageId: number) => {
    setMessages((list) => list.filter((item) => item.id !== messageId));
    setReactions((prev) => {
      if (!(messageId in prev)) return prev;
      const next = { ...prev };
      delete next[messageId];
      return next;
    });
  }, []);

  const handleGroupGone = useCallback(() => {
    if (closedRef.current) return;
    closedRef.current = true;
    toast.error("This group is no longer available.");
    router.push(listHref);
    router.refresh();
  }, [listHref, router]);

  const refetchLatest = useCallback(() => {
    router.refresh();
  }, [router]);

  const { typingLabel, notifyTyping, stopTyping } = useGroupChatRealtime({
    groupId: space.id,
    enabled: isGroupChat,
    onNew: handleNewMessage,
    onEdited: handleReplacedMessage,
    onDeleted: handleDeletedMessage,
    onReaction: handleReplacedMessage,
    onArchived: setReadOnly,
    onGroupGone: handleGroupGone,
    refetch: refetchLatest,
  });

  useEffect(() => {
    if (readOnly) stopTyping();
  }, [readOnly, stopTyping]);

  useEffect(() => {
    if (!isGroupChat) return;
    const el = listRef.current;
    if (!el || !stickToBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, typingLabel, isGroupChat]);

  const filteredMembers = useMemo(() => {
    const q = memberQuery.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (member) =>
        member.fullName.toLowerCase().includes(q) ||
        member.email?.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q)
    );
  }, [members, memberQuery]);

  const applyReactionFromMessage = useCallback((message: ForumSpaceMessage) => {
    setMessages((list) => {
      if (!list.some((item) => item.id === message.id)) return list;
      return list.map((item) =>
        item.id === message.id
          ? {
              ...item,
              ...message,
              myReaction: message.myReaction ?? null,
              reactionTypeCount:
                message.reactionTypeCount ?? item.reactionTypeCount,
              attachments: message.attachments?.length
                ? message.attachments
                : item.attachments,
              author: message.author?.id ? message.author : item.author,
            }
          : item
      );
    });
    setReactions((prev) => ({
      ...prev,
      [message.id]: {
        like: message.reactionTypeCount.like,
        dislike: message.reactionTypeCount.dislike,
        mine: message.myReaction ?? null,
      },
    }));
  }, []);

  const toggleReaction = async (
    messageId: number,
    type: "like" | "dislike"
  ) => {
    if (viewOnly || readOnly || reactingMessageId != null) return;

    const current = reactions[messageId] ?? {
      like: 0,
      dislike: 0,
      mine: null as "like" | "dislike" | null,
    };
    const removing = current.mine === type;

    try {
      setReactingMessageId(messageId);
      const response = await fetchAuthed(
        `/api/discussion-forum/messages/${messageId}/reactions`,
        {
          method: removing ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            removing
              ? { group_id: space.id }
              : { reaction_type: type, group_id: space.id }
          ),
        }
      );

      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        data?: ForumSpaceMessage;
      } | null;

      if (!response.ok || !body?.ok) {
        throw new Error(body?.error || "Unable to update reaction.");
      }

      if (body.data) {
        applyReactionFromMessage(body.data);
      } else if (removing) {
        setReactions((prev) => {
          const existing = prev[messageId] ?? {
            like: 0,
            dislike: 0,
            mine: null,
          };
          return {
            ...prev,
            [messageId]: {
              ...existing,
              [type]: Math.max(0, existing[type] - 1),
              mine: null,
            },
          };
        });
        setMessages((list) =>
          list.map((item) =>
            item.id === messageId
              ? {
                  ...item,
                  myReaction: null,
                  reactionTypeCount: {
                    ...item.reactionTypeCount,
                    [type]: Math.max(0, item.reactionTypeCount[type] - 1),
                  },
                }
              : item
          )
        );
      } else {
        throw new Error("Unable to update reaction.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update reaction."
      );
    } finally {
      setReactingMessageId(null);
    }
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

      <div className="mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-h4 font-semibold text-text-primary">{space.name}</h1>
          <span className="rounded-full border border-border-default px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-dimmed">
            {kind === "groups" ? "Group" : "Channel"}
          </span>
        </div>
        {space.description ? (
          <p className="mt-1 text-body-sm text-text-muted">{space.description}</p>
        ) : null}
      </div>

      <div className="grid items-stretch gap-4 xl:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="flex max-h-[min(72vh,42rem)] flex-col gap-3 overflow-hidden rounded-2xl border border-border-default bg-bg-surface p-3.5">
          <div className="grid shrink-0 grid-cols-3 gap-2">
            <div className="rounded-xl border border-border-subtle bg-orange-500/10 px-2.5 py-2.5">
              <Users className="mb-1.5 size-3.5 text-orange-400" aria-hidden />
              <p className="text-body font-semibold tabular-nums text-text-primary">
                {formatForumCount(memberCount)}
              </p>
              <p className="text-[11px] text-text-dimmed">Members</p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-orange-500/10 px-2.5 py-2.5">
              <MessageSquare
                className="mb-1.5 size-3.5 text-orange-400"
                aria-hidden
              />
              <p className="text-body font-semibold tabular-nums text-text-primary">
                {formatForumCount(space.messageCount || messages.length)}
              </p>
              <p className="text-[11px] text-text-dimmed">
                {kind === "groups" ? "Topics" : "Posts"}
              </p>
            </div>
            <div className="rounded-xl border border-border-subtle bg-orange-500/10 px-2.5 py-2.5">
              <Activity className="mb-1.5 size-3.5 text-orange-400" aria-hidden />
              <p className="text-[11px] font-semibold leading-tight text-text-primary">
                {activityLabel(space.lastActiveAt)}
              </p>
              <p className="mt-1 text-[11px] text-text-dimmed">Activity</p>
            </div>
          </div>

          {space.createdByName ? (
            <p className="shrink-0 text-caption text-text-muted">
              Created by{" "}
              <span className="font-medium text-text-primary">
                {space.createdByName}
              </span>
              {space.createdByRole ? (
                <span
                  className={cn(
                    "ml-2 inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    roleBadgeClass(space.createdByRole)
                  )}
                >
                  {space.createdByRole}
                </span>
              ) : null}
            </p>
          ) : null}

          <div className="flex min-h-0 flex-1 flex-col">
            <p className="mb-2 shrink-0 text-body-sm font-semibold text-text-primary">
              Members{" "}
              <span className="font-normal text-text-dimmed">
                {formatForumCount(memberCount)}
              </span>
            </p>
            <div className="relative mb-2.5 shrink-0">
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
            <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain pr-0.5">
              {filteredMembers.length ? (
                filteredMembers.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center gap-2.5 rounded-xl border border-border-subtle bg-bg-tertiary/40 px-2.5 py-2"
                  >
                    <ForumAvatar
                      name={member.fullName}
                      className="size-9"
                      textClassName="text-[11px]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                        <p className="truncate text-body-sm font-medium text-text-primary">
                          {member.fullName}
                        </p>
                        {member.role ? (
                          <span
                            className={cn(
                              "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
                              roleBadgeClass(member.role)
                            )}
                          >
                            {member.role}
                          </span>
                        ) : null}
                      </div>
                      {member.email ? (
                        <p className="mt-0.5 truncate text-caption text-text-dimmed">
                          {member.email}
                        </p>
                      ) : null}
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-caption text-text-muted">
                  No members to show.
                </li>
              )}
            </ul>
          </div>
        </aside>

        <div className="flex h-[min(72vh,42rem)] min-h-[28rem] flex-col overflow-hidden rounded-2xl border border-border-default bg-bg-surface">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border-subtle px-4 py-3">
            <div>
              <p className="text-body-sm font-semibold text-text-primary">
                {kind === "groups" ? "Group Messages" : "Channel Messages"}
              </p>
              <p className="text-caption text-text-dimmed">
                {viewOnly
                  ? `${formatForumCount(messages.length)} messages · view only`
                  : `${formatForumCount(messages.length)} messages loaded`}
              </p>
            </div>
          </div>

          <div
            ref={listRef}
            className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-4"
            onScroll={(event) => {
              if (!isGroupChat) return;
              const el = event.currentTarget;
              stickToBottomRef.current =
                el.scrollHeight - el.scrollTop - el.clientHeight < 80;
            }}
          >
            {messages.length ? (
              messages.map((message) => {
                const reaction = reactions[message.id] ?? {
                  like: message.reactionTypeCount.like,
                  dislike: message.reactionTypeCount.dislike,
                  mine: message.myReaction ?? null,
                };
                const attachments = message.attachments ?? [];
                const isMine = Boolean(
                  currentUserId && message.author.id === currentUserId
                );
                const moderated =
                  message.status?.toLowerCase() === "moderated";
                const showText = hasVisibleContent(message.content);

                return (
                  <article
                    key={message.id}
                    className={cn(
                      "flex gap-2.5",
                      isMine ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <ForumAvatar
                      name={message.author.fullName}
                      className="mt-0.5 size-9"
                      textClassName="text-[11px]"
                    />
                    <div
                      className={cn(
                        "min-w-0 max-w-[min(100%,28rem)]",
                        isMine && "items-end text-right"
                      )}
                    >
                      <div
                        className={cn(
                          "flex flex-wrap items-center gap-2",
                          isMine && "justify-end"
                        )}
                      >
                        <p className="text-body-sm font-semibold text-text-primary">
                          {message.author.fullName}
                        </p>
                        <p className="text-caption text-text-dimmed">
                          {formatChatTimestamp(message.createdAt)}
                        </p>
                        {moderated ? (
                          <span className="rounded-md border border-amber-500/35 bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                            Moderated
                          </span>
                        ) : null}
                      </div>

                      {showText ? (
                        looksLikeHtml(message.content) ? (
                          <div
                            className={cn(
                              "forum-answer-prose mt-1.5 rounded-2xl border border-border-subtle bg-bg-tertiary/55 px-3 py-2 text-left text-body-sm leading-relaxed text-text-secondary [&_p]:mb-1",
                              isMine && "border-orange-500/20 bg-orange-500/10"
                            )}
                            dangerouslySetInnerHTML={{
                              __html: message.content,
                            }}
                          />
                        ) : (
                          <p
                            className={cn(
                              "mt-1.5 whitespace-pre-wrap rounded-2xl border border-border-subtle bg-bg-tertiary/55 px-3 py-2 text-left text-body-sm leading-relaxed text-text-secondary",
                              isMine && "border-orange-500/20 bg-orange-500/10"
                            )}
                          >
                            {message.content}
                          </p>
                        )
                      ) : null}

                      <SpaceMessageAttachments
                        attachments={attachments}
                        align={isMine ? "end" : "start"}
                      />

                      <div
                        className={cn(
                          "mt-1.5 flex flex-wrap items-center gap-1",
                          isMine && "justify-end"
                        )}
                      >
                        {viewOnly || readOnly ? (
                          <>
                            <span className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption text-text-muted">
                              <ThumbsUp className="size-3.5" aria-hidden />
                              {reaction.like}
                            </span>
                            <span className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption text-text-muted">
                              <ThumbsDown className="size-3.5" aria-hidden />
                              {reaction.dislike}
                            </span>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                void toggleReaction(message.id, "like")
                              }
                              disabled={reactingMessageId === message.id}
                              className={cn(
                                "inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption transition-colors disabled:opacity-50",
                                reaction.mine === "like"
                                  ? "bg-orange-500/15 text-orange-400"
                                  : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
                              )}
                              aria-pressed={reaction.mine === "like"}
                              aria-label={
                                reaction.mine === "like" ? "Remove like" : "Like"
                              }
                            >
                              <ThumbsUp className="size-3.5" />
                              {reaction.like}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                void toggleReaction(message.id, "dislike")
                              }
                              disabled={reactingMessageId === message.id}
                              className={cn(
                                "inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption transition-colors disabled:opacity-50",
                                reaction.mine === "dislike"
                                  ? "bg-accent-red/15 text-accent-red"
                                  : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
                              )}
                              aria-pressed={reaction.mine === "dislike"}
                              aria-label={
                                reaction.mine === "dislike"
                                  ? "Remove dislike"
                                  : "Dislike"
                              }
                            >
                              <ThumbsDown className="size-3.5" />
                              {reaction.dislike}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="py-12 text-center text-body-sm text-text-muted">
                {viewOnly
                  ? "No messages in this channel yet."
                  : readOnly
                    ? "No messages in this group yet."
                    : "No messages yet. Be the first to reply."}
              </p>
            )}
          </div>

          {isGroupChat && typingLabel ? (
            <p
              className="px-4 pt-1 text-caption text-text-dimmed"
              aria-live="polite"
            >
              {typingLabel}
            </p>
          ) : null}

          {viewOnly ? (
            <div className="border-t border-border-subtle px-4 py-3">
              <p className="text-center text-caption text-text-dimmed">
                Only admins can post in channels. You can view messages here.
              </p>
            </div>
          ) : readOnly ? (
            <div className="border-t border-border-subtle px-4 py-3">
              <p className="text-center text-caption text-text-dimmed">
                This group is archived. You can read messages, but not send new
                ones.
              </p>
            </div>
          ) : (
            <div className="border-t border-border-subtle p-3">
              <ForumMessageComposer
                variant="compact"
                placeholder="Write a message..."
                submitLabel="Send"
                onDraftChange={(html) => {
                  if (!isGroupChat) return;
                  if (!html.trim() || isForumRichTextEmpty(html)) stopTyping();
                  else notifyTyping();
                }}
                onSubmit={async ({ html, files }) => {
                  stopTyping();
                  const content = html.trim();
                  if (!content && files.length === 0) {
                    toast.error("Write a message before sending.");
                    throw new Error("Empty");
                  }

                  const form = new FormData();
                  form.append("group_id", String(space.id));
                  form.append("content", content);
                  for (const file of files) {
                    form.append("files", file, file.name);
                  }

                  const response = await fetchAuthed(
                    "/api/discussion-forum/messages",
                    { method: "POST", body: form }
                  );

                  const body = (await response.json().catch(() => null)) as {
                    ok?: boolean;
                    error?: string;
                    data?: ForumSpaceMessage;
                  } | null;

                  if (!response.ok || !body?.ok || !body.data) {
                    throw new Error(body?.error || "Unable to send message.");
                  }

                  const next = body.data;
                  setMessages((prev) =>
                    prev.some((item) => item.id === next.id)
                      ? prev
                      : [...prev, next]
                  );
                  setReactions((prev) => ({
                    ...prev,
                    [next.id]: {
                      like: next.reactionTypeCount.like,
                      dislike: next.reactionTypeCount.dislike,
                      mine: next.myReaction ?? null,
                    },
                  }));
                  toast.success("Message sent.");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </DiscussionForumShell>
  );
}
