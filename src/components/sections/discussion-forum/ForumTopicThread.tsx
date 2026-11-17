"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  FileText,
  LogIn,
  MessageSquareReply,
  Pencil,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { ForumAvatar } from "@/components/sections/discussion-forum/ForumAvatar";
import { ForumMessageComposer } from "@/components/sections/discussion-forum/ForumMessageComposer";
import {
  ForumRichTextEditor,
  isForumRichTextEmpty,
} from "@/components/sections/discussion-forum/ForumRichTextEditor";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import type {
  ForumPreviewAnswer,
  ForumPreviewAttachment,
  ForumPreviewQuestion,
} from "@/data/discussion-forum";
import { fetchAuthed } from "@/lib/auth/session-expired";
import {
  canEditForumMessage,
  formatForumCount,
  formatForumRelativeTime,
} from "@/lib/forum/format";
import { cn } from "@/lib/utils";

type ForumTopicThreadProps = {
  topic: ForumPreviewQuestion;
  initialPosts: ForumPreviewAnswer[];
  /** Total top-level posts reported by the API (may exceed the loaded page). */
  totalTopLevel: number;
  groupId: number;
  groupSlug: string;
  groupName: string;
  canInteract: boolean;
  currentUserId: string | null;
  loginHref: string;
  signupHref: string;
  createTopicHref: string;
};

type ApiResult<T> = { ok?: boolean; error?: string; data?: T } | null;

/** Indent stops growing after this depth so deep threads stay readable on phones. */
const MAX_INDENT_DEPTH = 3;

function formatStamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Attachments({ attachments }: { attachments: ForumPreviewAttachment[] }) {
  if (!attachments.length) return null;
  const images = attachments.filter((item) => item.isImage);
  const files = attachments.filter((item) => !item.isImage);

  return (
    <div className="mt-3 space-y-2">
      {images.length ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((attachment) => (
            <li key={attachment.id}>
              <a
                href={attachment.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-[6px] border border-neutral-200 bg-section-cream"
              >
                {/* Native img: attachment hosts vary (S3 / CDN). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachment.filePath}
                  alt={attachment.fileName}
                  loading="lazy"
                  className="aspect-video w-full object-contain"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      {files.length ? (
        <ul className="space-y-1.5">
          {files.map((attachment) => (
            <li key={attachment.id}>
              <a
                href={attachment.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-2 rounded-[6px] border border-neutral-200 bg-section-cream px-2.5 py-1.5 text-caption text-neutral-700 transition-colors hover:border-orange-400 hover:text-orange-600"
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

/** Card header: author avatar + name, with a meta line (badge / timestamp) below. */
function PostCardHeader({
  name,
  avatar,
  badge,
  meta,
}: {
  name: string;
  avatar: string | null;
  badge?: string;
  meta: React.ReactNode;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-section-beige bg-section-beige/60 px-4 py-3">
      <ForumAvatar name={name} src={avatar} className="size-10" textClassName="text-xs" />
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 text-body-sm">
          <span className="break-words font-semibold text-orange-600">{name}</span>
          {badge ? (
            <span className="rounded-[4px] bg-orange-100 px-1.5 py-0.5 text-caption font-medium text-orange-700">
              {badge}
            </span>
          ) : null}
        </p>
        <p className="text-caption text-neutral-500">{meta}</p>
      </div>
    </header>
  );
}

/** Card footer row that holds the post actions. */
const cardFooter =
  "flex flex-wrap items-center gap-1 border-t border-neutral-100 bg-section-cream/70 px-3 py-2";

const actionButton =
  "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-caption font-medium transition-colors disabled:cursor-default disabled:opacity-50";

/** GMAT Club–style topic view: original post, threaded replies, reply box. */
export function ForumTopicThread({
  topic,
  initialPosts,
  totalTopLevel,
  groupId,
  groupSlug,
  groupName,
  canInteract,
  currentUserId,
  loginHref,
  signupHref,
  createTopicHref,
}: ForumTopicThreadProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<ForumPreviewAnswer[]>(initialPosts);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reactingId, setReactingId] = useState<number | null>(null);
  const [loadingRepliesId, setLoadingRepliesId] = useState<number | null>(null);

  // Navigating between topics reuses this component; reset to the new thread.
  const [syncedInitial, setSyncedInitial] = useState(initialPosts);
  if (syncedInitial !== initialPosts) {
    setSyncedInitial(initialPosts);
    setPosts(initialPosts);
    setReplyingTo(null);
    setEditingId(null);
  }

  const { topLevel, childrenOf } = useMemo(() => {
    const ids = new Set(posts.map((post) => post.id));
    const map = new Map<number, ForumPreviewAnswer[]>();
    const roots: ForumPreviewAnswer[] = [];
    for (const post of posts) {
      const parent = post.parentMessageId ?? null;
      // Orphans (parent deleted / not loaded) render at the top level.
      if (parent == null || !ids.has(parent)) {
        roots.push(post);
      } else {
        map.set(parent, [...(map.get(parent) ?? []), post]);
      }
    }
    return { topLevel: roots, childrenOf: map };
  }, [posts]);

  const totalLoaded = posts.length;
  const replyLabel = `${formatForumCount(Math.max(totalLoaded, totalTopLevel))} ${
    Math.max(totalLoaded, totalTopLevel) === 1 ? "reply" : "replies"
  }`;

  const requireLogin = (message: string) => {
    toast.error(message);
    router.push(loginHref);
  };

  const mergePost = (id: number, next: ForumPreviewAnswer) => {
    setPosts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...next,
              attachments: next.attachments?.length ? next.attachments : item.attachments,
              author: next.author?.id ? next.author : item.author,
              // Mutation responses don't always echo thread fields.
              parentMessageId: next.parentMessageId ?? item.parentMessageId ?? null,
              replyCount: Math.max(next.replyCount ?? 0, item.replyCount ?? 0),
            }
          : item
      )
    );
  };

  const toggleReaction = async (postId: number, type: "like" | "dislike") => {
    if (!canInteract) {
      requireLogin("Sign in to react to a reply.");
      return;
    }
    if (reactingId != null) return;
    const current = posts.find((item) => item.id === postId);
    const removing = current?.myReaction === type;

    try {
      setReactingId(postId);
      const response = await fetchAuthed(`/api/discussion-forum/messages/${postId}/reactions`, {
        method: removing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(removing ? {} : { reaction_type: type }),
          topic_id: topic.id,
          topic_slug: topic.slug,
          forum_slug: groupSlug,
        }),
      });
      const body = (await response.json().catch(() => null)) as ApiResult<ForumPreviewAnswer>;
      if (!response.ok || !body?.ok) {
        throw new Error(body?.error || "Unable to update reaction.");
      }

      if (body.data) {
        mergePost(postId, { ...body.data, myReaction: body.data.myReaction ?? null });
      } else if (removing && current) {
        mergePost(postId, {
          ...current,
          myReaction: null,
          reactionTypeCount: {
            ...current.reactionTypeCount,
            [type]: Math.max(0, current.reactionTypeCount[type] - 1),
          },
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update reaction.");
    } finally {
      setReactingId(null);
    }
  };

  const submitPost = async (
    { html, files }: { html: string; files: File[] },
    parentMessageId: number | null
  ) => {
    if (isForumRichTextEmpty(html) && files.length === 0) {
      toast.error("Write a reply before posting.");
      throw new Error("Write a reply before posting.");
    }

    const form = new FormData();
    form.append("group_id", String(groupId));
    form.append("topic_slug", topic.slug);
    form.append("forum_slug", groupSlug);
    form.append("topic_id", String(topic.id));
    form.append("content", html.trim());
    if (parentMessageId) form.append("parent_message_id", String(parentMessageId));
    for (const file of files) form.append("files", file, file.name);

    const response = await fetchAuthed("/api/discussion-forum/messages", {
      method: "POST",
      body: form,
    });
    const body = (await response.json().catch(() => null)) as ApiResult<ForumPreviewAnswer>;
    if (!response.ok || !body?.ok || !body.data) {
      throw new Error(body?.error || "Unable to post reply.");
    }

    const created: ForumPreviewAnswer = {
      ...body.data,
      parentMessageId: body.data.parentMessageId ?? parentMessageId,
      replyCount: body.data.replyCount ?? 0,
    };
    setPosts((prev) => {
      if (prev.some((item) => item.id === created.id)) return prev;
      const next = parentMessageId
        ? prev.map((item) =>
            item.id === parentMessageId
              ? { ...item, replyCount: (item.replyCount ?? 0) + 1 }
              : item
          )
        : prev;
      return [...next, created];
    });
    setReplyingTo(null);
    toast.success("Reply posted.");
    // Bring the new post into view without jumping the whole page.
    requestAnimationFrame(() => {
      document
        .getElementById(`post-${created.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  const loadReplies = async (parentId: number) => {
    if (loadingRepliesId != null) return;
    try {
      setLoadingRepliesId(parentId);
      const params = new URLSearchParams({
        group_id: String(groupId),
        group_slug: groupSlug,
        topic_slug: topic.slug,
        topic_id: String(topic.id),
        parent_message_id: String(parentId),
      });
      const response = await fetch(`/api/discussion-forum/messages?${params}`);
      const body = (await response.json().catch(() => null)) as ApiResult<ForumPreviewAnswer[]>;
      if (!response.ok || !body?.ok || !body.data) {
        throw new Error(body?.error || "Unable to load replies.");
      }
      const loaded = body.data.map((item) => ({
        ...item,
        parentMessageId: item.parentMessageId ?? parentId,
      }));
      setPosts((prev) => {
        const known = new Set(prev.map((item) => item.id));
        return [...prev, ...loaded.filter((item) => !known.has(item.id))];
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load replies.");
    } finally {
      setLoadingRepliesId(null);
    }
  };

  const startEdit = (post: ForumPreviewAnswer) => {
    if (!canEditForumMessage(post.createdAt)) {
      toast.error("Edit window of 4 hour(s) has expired for this message");
      return;
    }
    setReplyingTo(null);
    setEditingId(post.id);
    setEditDraft(post.content || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft("");
    setSavingEdit(false);
  };

  const saveEdit = async (postId: number) => {
    if (isForumRichTextEmpty(editDraft)) {
      toast.error("Write a reply before saving.");
      return;
    }
    try {
      setSavingEdit(true);
      const response = await fetchAuthed(`/api/discussion-forum/messages/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: editDraft.trim(),
          topic_id: topic.id,
          topic_slug: topic.slug,
          forum_slug: groupSlug,
        }),
      });
      const body = (await response.json().catch(() => null)) as ApiResult<ForumPreviewAnswer>;
      if (!response.ok || !body?.ok || !body.data) {
        throw new Error(body?.error || "Unable to edit reply.");
      }
      mergePost(postId, body.data);
      cancelEdit();
      toast.success("Reply updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to edit reply.");
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (deletingId == null) return;
    try {
      setDeleting(true);
      const query = new URLSearchParams({ forum_slug: groupSlug, topic_slug: topic.slug });
      const response = await fetchAuthed(
        `/api/discussion-forum/messages/${deletingId}?${query}`,
        { method: "DELETE" }
      );
      const body = (await response.json().catch(() => null)) as ApiResult<unknown>;
      if (!response.ok || !body?.ok) {
        throw new Error(body?.error || "Unable to delete reply.");
      }
      const removed = posts.find((item) => item.id === deletingId);
      setPosts((prev) =>
        prev
          .filter((item) => item.id !== deletingId)
          .map((item) =>
            removed?.parentMessageId && item.id === removed.parentMessageId
              ? { ...item, replyCount: Math.max(0, (item.replyCount ?? 1) - 1) }
              : item
          )
      );
      if (editingId === deletingId) cancelEdit();
      setDeletingId(null);
      toast.success("Reply deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete reply.");
    } finally {
      setDeleting(false);
    }
  };

  const openReply = (postId: number) => {
    if (!canInteract) {
      requireLogin("Sign in to reply.");
      return;
    }
    setEditingId(null);
    setReplyingTo((current) => (current === postId ? null : postId));
  };

  const renderPost = (post: ForumPreviewAnswer, depth: number): React.ReactNode => {
    const children = childrenOf.get(post.id) ?? [];
    const hiddenReplies = Math.max(0, (post.replyCount ?? 0) - children.length);
    const isOwn = Boolean(currentUserId && post.author.id && post.author.id === currentUserId);
    const isEditing = editingId === post.id && canEditForumMessage(post.createdAt);
    const like = post.reactionTypeCount?.like ?? 0;
    const dislike = post.reactionTypeCount?.dislike ?? 0;

    return (
      <li key={post.id} className="space-y-3">
        <article
          id={`post-${post.id}`}
          aria-label={`Reply by ${post.author.fullName}`}
          className="flex scroll-mt-24 flex-col overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm"
        >
          <PostCardHeader
            name={post.author.fullName}
            avatar={post.author.profilePicturePath}
            meta={
              <>
                <time dateTime={post.createdAt}>{formatStamp(post.createdAt)}</time>
                {post.editedAt ? ` · edited ${formatForumRelativeTime(post.editedAt)}` : null}
              </>
            }
          />
          <div className="min-w-0 px-4 py-3">
            {isEditing ? (
              <div className="space-y-3">
                <ForumRichTextEditor
                  value={editDraft}
                  onChange={setEditDraft}
                  disabled={savingEdit}
                  placeholder="Edit your reply..."
                  minHeight={88}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-primary rounded-[6px] px-3.5 py-2 text-body-sm font-semibold disabled:opacity-50"
                    disabled={savingEdit}
                    onClick={() => void saveEdit(post.id)}
                  >
                    {savingEdit ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    className="rounded-[6px] border border-neutral-300 px-3.5 py-2 text-body-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
                    disabled={savingEdit}
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                {post.content ? (
                  <div
                    className="forum-answer-prose space-y-2 break-words text-body-sm leading-relaxed text-neutral-800 [&_p:last-child]:mb-0 [&_p]:mb-2"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : null}
                <Attachments attachments={post.attachments} />
              </>
            )}
          </div>

          <footer className={cardFooter}>
              <button
                type="button"
                onClick={() => void toggleReaction(post.id, "like")}
                disabled={reactingId === post.id}
                aria-pressed={post.myReaction === "like"}
                aria-label={post.myReaction === "like" ? "Remove like" : "Like"}
                className={cn(
                  actionButton,
                  post.myReaction === "like"
                    ? "bg-orange-100 text-orange-700"
                    : "text-neutral-600 hover:bg-orange-50 hover:text-orange-600"
                )}
              >
                <ThumbsUp className="size-3.5" aria-hidden />
                <span className="tabular-nums">{formatForumCount(like)}</span>
              </button>
              <button
                type="button"
                onClick={() => void toggleReaction(post.id, "dislike")}
                disabled={reactingId === post.id}
                aria-pressed={post.myReaction === "dislike"}
                aria-label={post.myReaction === "dislike" ? "Remove dislike" : "Dislike"}
                className={cn(
                  actionButton,
                  post.myReaction === "dislike"
                    ? "bg-red-50 text-red-600"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <ThumbsDown className="size-3.5" aria-hidden />
                <span className="tabular-nums">{formatForumCount(dislike)}</span>
              </button>
              <button
                type="button"
                onClick={() => openReply(post.id)}
                aria-expanded={replyingTo === post.id}
                className={cn(actionButton, "text-neutral-600 hover:bg-orange-50 hover:text-orange-600")}
              >
                <MessageSquareReply className="size-3.5" aria-hidden />
                Reply
              </button>
              {isOwn ? (
                <>
                  {canEditForumMessage(post.createdAt) ? (
                    <button
                      type="button"
                      onClick={() => startEdit(post)}
                      className={cn(actionButton, "text-neutral-600 hover:bg-orange-50 hover:text-orange-600")}
                    >
                      <Pencil className="size-3.5" aria-hidden />
                      Edit
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setDeletingId(post.id)}
                    className={cn(actionButton, "text-neutral-600 hover:bg-red-50 hover:text-red-600")}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Delete
                  </button>
                </>
              ) : null}
          </footer>
        </article>

        {replyingTo === post.id && canInteract ? (
          <div className="ml-3 border-l-2 border-orange-500/30 pl-3 md:ml-10">
            <p className="mb-2 text-caption text-neutral-500">
              Replying to <span className="font-semibold text-orange-600">{post.author.fullName}</span>
            </p>
            <ForumMessageComposer
              placeholder="Write your reply..."
              submitLabel="Post Reply"
              onSubmit={(payload) => submitPost(payload, post.id)}
            />
          </div>
        ) : null}

        {children.length || hiddenReplies > 0 ? (
          <div
            className={cn(
              depth < MAX_INDENT_DEPTH && "ml-3 border-l-2 border-orange-200 pl-3 md:ml-6 md:pl-4"
            )}
          >
            {children.length ? (
              <ul className="space-y-3">{children.map((child) => renderPost(child, depth + 1))}</ul>
            ) : null}
            {hiddenReplies > 0 ? (
              <button
                type="button"
                onClick={() => void loadReplies(post.id)}
                disabled={loadingRepliesId === post.id}
                className={cn(actionButton, "mt-2 font-semibold text-orange-600 hover:bg-orange-50")}
              >
                <ChevronDown className="size-3.5" aria-hidden />
                {loadingRepliesId === post.id
                  ? "Loading replies…"
                  : `View ${hiddenReplies} ${hiddenReplies === 1 ? "reply" : "replies"}`}
              </button>
            ) : null}
          </div>
        ) : null}
      </li>
    );
  };

  return (
    <>
      <article className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-neutral-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="min-w-0 break-words text-h3 font-bold leading-snug text-neutral-900">
            {topic.title}
          </h1>
          <div className="flex shrink-0 gap-2">
            <Link
              href={createTopicHref}
              className="inline-flex h-9 items-center gap-1.5 rounded-[6px] border border-orange-500 px-3 text-body-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
            >
              <Plus className="size-4" aria-hidden />
              Create Topic
            </Link>
            <a
              href="#forum-reply-box"
              className="btn-primary inline-flex h-9 items-center gap-1.5 rounded-[6px] px-3 text-body-sm font-semibold"
            >
              <MessageSquareReply className="size-4" aria-hidden />
              Reply
            </a>
          </div>
        </header>

        <PostCardHeader
          name={topic.author.fullName}
          avatar={topic.author.profilePicturePath}
          badge="Topic author"
          meta={
            <>
              Posted <time dateTime={topic.createdAt}>{formatStamp(topic.createdAt)}</time> in{" "}
              <span className="font-semibold text-orange-600">{groupName}</span>
            </>
          }
        />
        <div className="min-w-0 px-5 py-4">
          {topic.content ? (
            <div
              className="forum-answer-prose space-y-2 break-words text-body leading-relaxed text-neutral-800 [&_p:last-child]:mb-0 [&_p]:mb-2"
              dangerouslySetInnerHTML={{ __html: topic.content }}
            />
          ) : null}
        </div>
        <footer className={cn(cardFooter, "justify-between px-4")}>
          <span className="inline-flex items-center gap-1.5 text-caption font-medium text-neutral-600">
            <MessageSquareReply className="size-3.5 text-orange-500" aria-hidden />
            {replyLabel}
          </span>
          <a
            href="#forum-reply-box"
            className={cn(actionButton, "text-neutral-600 hover:bg-orange-50 hover:text-orange-600")}
          >
            <MessageSquareReply className="size-3.5" aria-hidden />
            Reply
          </a>
        </footer>
      </article>

      <section aria-labelledby="forum-replies-heading" className="mt-6">
        <h2 id="forum-replies-heading" className="mb-3 text-body font-semibold text-neutral-900">
          {replyLabel}
        </h2>
        {topLevel.length ? (
          <ul className="space-y-3">{topLevel.map((post) => renderPost(post, 0))}</ul>
        ) : (
          <p className="rounded-xl border border-orange-100 bg-white px-4 py-8 text-center text-body-sm text-neutral-600">
            No replies yet. Be the first to reply.
          </p>
        )}
        {totalTopLevel > topLevel.length ? (
          <p className="mt-3 text-caption text-neutral-500">
            Showing the first {topLevel.length} of {totalTopLevel} replies.
          </p>
        ) : null}
      </section>

      <section id="forum-reply-box" aria-labelledby="forum-reply-heading" className="mt-6 scroll-mt-24">
        <h2 id="forum-reply-heading" className="mb-3 text-body font-semibold text-neutral-900">
          Post a reply
        </h2>
        {canInteract ? (
          <ForumMessageComposer
            placeholder="Share your answer or thoughts..."
            submitLabel="Post Reply"
            onSubmit={(payload) => submitPost(payload, null)}
          />
        ) : (
          <div className="rounded-xl border border-orange-100 bg-orange-50/60 px-4 py-6 text-center">
            <p className="text-body-sm text-neutral-700">
              Sign in to reply, react and join the discussion.
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Link
                href={loginHref}
                className="btn-primary inline-flex h-9 items-center gap-1.5 rounded-[6px] px-4 text-body-sm font-semibold"
              >
                <LogIn className="size-4" aria-hidden />
                Sign In
              </Link>
              <Link
                href={signupHref}
                className="inline-flex h-9 items-center rounded-[6px] border border-neutral-300 bg-white px-4 text-body-sm font-medium text-neutral-800 transition-colors hover:border-orange-400 hover:text-orange-600"
              >
                Join Now
              </Link>
            </div>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={deletingId != null}
        title="Delete reply?"
        description="This removes your reply from the discussion. This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        confirming={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!deleting) setDeletingId(null);
        }}
      />
    </>
  );
}
