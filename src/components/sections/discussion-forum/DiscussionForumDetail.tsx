"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  FileText,
  LogIn,
  Pencil,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { ForumAvatar } from "@/components/sections/discussion-forum/ForumAvatar";
import {
  DiscussionForumShell,
  type DiscussionForumHero,
} from "@/components/sections/discussion-forum/DiscussionForumShell";
import { ForumMessageComposer } from "@/components/sections/discussion-forum/ForumMessageComposer";
import {
  ForumRichTextEditor,
  isForumRichTextEmpty,
} from "@/components/sections/discussion-forum/ForumRichTextEditor";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  formatForumCount,
  formatForumRelativeTime,
  type ForumPreviewAnswer,
  type ForumPreviewAttachment,
  type ForumPreviewQuestion,
} from "@/data/discussion-forum";
import { fetchAuthed } from "@/lib/auth/session-expired";
import { cn } from "@/lib/utils";

type DiscussionForumDetailProps = {
  question: ForumPreviewQuestion;
  answers: ForumPreviewAnswer[];
  basePath?: string;
  forum: DiscussionForumHero;
  questions?: ForumPreviewQuestion[];
  groupId: number;
  topicSlug: string;
  canAnswer: boolean;
  currentUserId: string | null;
  loginHref: string;
};

function AnswerAttachments({
  attachments,
}: {
  attachments: ForumPreviewAttachment[];
}) {
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
                className="block overflow-hidden rounded-xl border border-border-default bg-bg-tertiary"
              >
                {/* Native img: attachment hosts vary (S3 / CDN / demos). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={attachment.filePath}
                  alt={attachment.fileName}
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

function forumSlugFromBasePath(basePath: string): string {
  const parts = basePath.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export function DiscussionForumDetail({
  question,
  answers: initialAnswers,
  basePath = "/discussion-forum",
  forum,
  questions = [],
  groupId,
  topicSlug,
  canAnswer,
  currentUserId,
  loginHref,
}: DiscussionForumDetailProps) {
  const router = useRouter();
  const forumSlug = forumSlugFromBasePath(basePath);
  const [answers, setAnswers] = useState<ForumPreviewAnswer[]>(initialAnswers);
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingAnswerId, setDeletingAnswerId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reactingAnswerId, setReactingAnswerId] = useState<number | null>(null);

  // Keep local list in sync when RSC refetch / revisit returns fresh answers.
  useEffect(() => {
    setAnswers(initialAnswers);
  }, [initialAnswers]);

  const requireLogin = () => {
    toast.error("Log in to react to an answer.");
    router.push(loginHref);
  };

  const toggleLike = async (answerId: number) => {
    if (!canAnswer) {
      requireLogin();
      return;
    }
    if (reactingAnswerId != null) return;

    const current = answers.find((item) => item.id === answerId);
    const removing = current?.myReaction === "like";

    try {
      setReactingAnswerId(answerId);
      const response = await fetchAuthed(
        `/api/discussion-forum/messages/${answerId}/reactions`,
        {
          method: removing ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            removing
              ? {
                  topic_id: question.id,
                  topic_slug: topicSlug,
                  forum_slug: forumSlug,
                }
              : {
                  reaction_type: "like",
                  topic_id: question.id,
                  topic_slug: topicSlug,
                  forum_slug: forumSlug,
                }
          ),
        }
      );

      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        data?: ForumPreviewAnswer;
      } | null;

      if (!response.ok || !body?.ok) {
        throw new Error(body?.error || "Unable to update reaction.");
      }

      if (body.data) {
        setAnswers((prev) =>
          prev.map((item) =>
            item.id === answerId
              ? {
                  ...item,
                  ...body.data!,
                  attachments: body.data!.attachments?.length
                    ? body.data!.attachments
                    : item.attachments,
                  reactionTypeCount:
                    body.data!.reactionTypeCount ?? item.reactionTypeCount,
                  myReaction: body.data!.myReaction ?? null,
                  author: body.data!.author?.id
                    ? body.data!.author
                    : item.author,
                }
              : item
          )
        );
      } else if (removing) {
        setAnswers((prev) =>
          prev.map((item) =>
            item.id === answerId
              ? {
                  ...item,
                  myReaction: null,
                  reactionTypeCount: {
                    ...item.reactionTypeCount,
                    like: Math.max(0, item.reactionTypeCount.like - 1),
                  },
                }
              : item
          )
        );
      } else {
        throw new Error("Unable to update reaction.");
      }
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update reaction."
      );
    } finally {
      setReactingAnswerId(null);
    }
  };

  const startEdit = (answer: ForumPreviewAnswer) => {
    setEditingAnswerId(answer.id);
    setEditDraft(answer.content || "");
  };

  const cancelEdit = () => {
    setEditingAnswerId(null);
    setEditDraft("");
    setSavingEdit(false);
  };

  const saveEdit = async (answerId: number) => {
    if (isForumRichTextEmpty(editDraft)) {
      toast.error("Write an answer before saving.");
      return;
    }

    try {
      setSavingEdit(true);
      const response = await fetchAuthed(
        `/api/discussion-forum/messages/${answerId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: editDraft.trim(),
            topic_id: question.id,
            topic_slug: topicSlug,
            forum_slug: forumSlug,
          }),
        }
      );

      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        data?: ForumPreviewAnswer;
      } | null;

      if (!response.ok || !body?.ok || !body.data) {
        throw new Error(body?.error || "Unable to edit answer.");
      }

      setAnswers((prev) =>
        prev.map((item) =>
          item.id === answerId
            ? {
                ...item,
                ...body.data!,
                attachments: body.data!.attachments?.length
                  ? body.data!.attachments
                  : item.attachments,
                reactionTypeCount:
                  body.data!.reactionTypeCount ?? item.reactionTypeCount,
                author: body.data!.author?.id
                  ? body.data!.author
                  : item.author,
              }
            : item
        )
      );
      cancelEdit();
      toast.success("Answer updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to edit answer.");
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (deletingAnswerId == null) return;

    try {
      setDeleting(true);
      const query = new URLSearchParams({
        forum_slug: forumSlug,
        topic_slug: topicSlug,
      });
      const response = await fetchAuthed(
        `/api/discussion-forum/messages/${deletingAnswerId}?${query}`,
        { method: "DELETE" }
      );

      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !body?.ok) {
        throw new Error(body?.error || "Unable to delete answer.");
      }

      setAnswers((prev) => prev.filter((item) => item.id !== deletingAnswerId));
      if (editingAnswerId === deletingAnswerId) cancelEdit();
      setDeletingAnswerId(null);
      toast.success("Answer deleted.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete answer."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
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

      <article className="min-w-0 overflow-hidden rounded-2xl border border-border-default bg-bg-surface p-4 sm:p-6">
        <h2 className="break-words text-h3 font-semibold tracking-tight text-text-primary">
          {question.title}
        </h2>
        <div
          className="forum-answer-prose mt-3 space-y-2 text-body-sm leading-relaxed text-text-secondary [&_p]:mb-2"
          dangerouslySetInnerHTML={{ __html: question.content }}
        />
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {question.tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`${basePath}?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-full border border-border-default bg-bg-tertiary px-2.5 py-0.5 text-caption font-medium text-text-secondary transition-colors hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-3">
          <p className="text-caption text-text-dimmed">
            asked {formatForumRelativeTime(question.createdAt)}
          </p>
          <div className="flex items-center gap-2.5">
            <ForumAvatar
              name={question.author.fullName}
              className="size-8"
              textClassName="text-[10px]"
            />
            <div>
              <p className="text-body-sm font-medium text-text-primary">
                {question.author.fullName}
              </p>
              {question.author.reputation != null ? (
                <p className="text-caption text-text-dimmed">
                  {formatForumCount(question.author.reputation)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      <div className="mt-6 flex h-[min(70vh,40rem)] min-h-[16rem] flex-col overflow-hidden rounded-2xl border border-border-default bg-bg-surface">
        <div className="shrink-0 border-b border-border-subtle px-4 py-3 sm:px-5">
          <h3 className="text-h4 font-semibold text-text-primary">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h3>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-3 sm:p-4">
        {answers.length ? (
        answers.map((answer, index) => (
          <article
            key={answer.id}
            className={cn(
              "min-w-0 overflow-hidden rounded-2xl border border-border-default bg-bg-tertiary/40 p-4 sm:p-5",
              answer.isAccepted && "border-accent-green/40 bg-accent-green/5"
            )}
          >
            <div className="min-w-0">
                {answer.isAccepted ? (
                  <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent-green/35 bg-accent-green/10 px-2.5 py-0.5 text-caption font-medium text-accent-green">
                    <BadgeCheck className="size-3.5" aria-hidden />
                    Accepted answer
                  </p>
                ) : null}
                {editingAnswerId === answer.id ? (
                  <div className="space-y-3">
                    <ForumRichTextEditor
                      value={editDraft}
                      onChange={setEditDraft}
                      disabled={savingEdit}
                      placeholder="Edit your answer..."
                      minHeight={88}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="btn-primary rounded-[6px] px-3.5 py-2 text-body-sm font-semibold disabled:opacity-50"
                        disabled={savingEdit}
                        onClick={() => void saveEdit(answer.id)}
                      >
                        {savingEdit ? "Saving…" : "Save"}
                      </button>
                      <button
                        type="button"
                        className="rounded-[6px] border border-border-default px-3.5 py-2 text-body-sm font-medium text-text-secondary transition-colors hover:bg-bg-hover disabled:opacity-50"
                        disabled={savingEdit}
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex min-w-0 items-start gap-2">
                      <span className="shrink-0 pt-0.5 text-body-sm font-semibold tabular-nums text-orange-400">
                        {index + 1}.
                      </span>
                      <div className="min-w-0 flex-1">
                        {answer.content ? (
                          <div
                            className="forum-answer-prose space-y-2 text-body-sm leading-relaxed text-text-secondary [&_p]:mb-2 [&_p:first-child]:mt-0"
                            dangerouslySetInnerHTML={{ __html: answer.content }}
                          />
                        ) : null}
                        <AnswerAttachments attachments={answer.attachments} />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => void toggleLike(answer.id)}
                        disabled={reactingAnswerId === answer.id}
                        className={cn(
                          "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-body-sm tabular-nums transition-colors disabled:opacity-50",
                          answer.myReaction === "like"
                            ? "bg-orange-500/20 font-semibold text-orange-400"
                            : "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                        )}
                        aria-pressed={answer.myReaction === "like"}
                        aria-label={
                          answer.myReaction === "like" ? "Remove like" : "Like"
                        }
                      >
                        <ThumbsUp className="size-3.5 shrink-0" aria-hidden />
                        <span>
                          {formatForumCount(answer.reactionTypeCount?.like ?? 0)}
                        </span>
                      </button>
                      <span
                        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-bg-tertiary px-2.5 text-body-sm tabular-nums text-text-muted"
                        aria-label={`${formatForumCount(answer.reactionTypeCount?.dislike ?? 0)} dislikes`}
                      >
                        <ThumbsDown className="size-3.5 shrink-0" aria-hidden />
                        <span>
                          {formatForumCount(
                            answer.reactionTypeCount?.dislike ?? 0
                          )}
                        </span>
                      </span>
                      {currentUserId &&
                      answer.author.id &&
                      answer.author.id === currentUserId ? (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(answer)}
                            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption text-text-muted transition-colors hover:bg-bg-hover hover:text-orange-400"
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingAnswerId(answer.id)}
                            className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-caption text-text-muted transition-colors hover:bg-accent-red/10 hover:text-accent-red"
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </>
                )}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-3">
                  <p className="text-caption text-text-dimmed">
                    {answer.editedAt
                      ? `edited ${formatForumRelativeTime(answer.editedAt)} · `
                      : null}
                    answered {formatForumRelativeTime(answer.createdAt)}
                  </p>
                  <div className="flex items-center gap-2.5">
                    <ForumAvatar
                      name={answer.author.fullName}
                      className="size-8"
                      textClassName="text-[10px]"
                    />
                    <p className="text-body-sm font-medium text-text-primary">
                      {answer.author.fullName}
                    </p>
                  </div>
                </div>
            </div>
          </article>
        ))
        ) : (
          <p className="py-12 text-center text-body-sm text-text-muted">
            No answers yet. Be the first to reply.
          </p>
        )}
        </div>
      </div>

      <div className="mt-6">
        <h4 className="mb-3 text-body font-semibold text-text-primary">Your answer</h4>
        {canAnswer ? (
          <ForumMessageComposer
            placeholder="Write an answer..."
            submitLabel="Post Answer"
            onSubmit={async ({ html, files }) => {
              if (isForumRichTextEmpty(html) && files.length === 0) {
                toast.error("Write an answer before posting.");
                throw new Error("Write an answer before posting.");
              }

              const form = new FormData();
              form.append("group_id", String(groupId));
              form.append("topic_slug", topicSlug);
              form.append("forum_slug", forumSlug);
              form.append("topic_id", String(question.id));
              form.append("content", html.trim());
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
                data?: ForumPreviewAnswer;
              } | null;

              if (!response.ok || !body?.ok || !body.data) {
                throw new Error(body?.error || "Unable to post answer.");
              }

              setAnswers((prev) => {
                if (prev.some((item) => item.id === body.data!.id)) return prev;
                return [...prev, body.data!];
              });
              toast.success("Answer posted.");
              router.refresh();
            }}
          />
        ) : (
          <div className="rounded-xl border border-border-default bg-bg-surface px-4 py-5 text-center sm:px-6">
            <p className="text-body-sm text-text-muted">
              Log in to post an answer to this question.
            </p>
            <Link
              href={loginHref}
              className="btn-primary mt-3 inline-flex items-center gap-2 rounded-[6px] px-3.5 py-2 text-body-sm font-semibold"
            >
              <LogIn className="size-4" aria-hidden />
              Log in to answer
            </Link>
          </div>
        )}
      </div>
    </DiscussionForumShell>

    <ConfirmDialog
      open={deletingAnswerId != null}
      title="Delete answer?"
      description="This permanently removes your answer. This cannot be undone."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      variant="danger"
      confirming={deleting}
      onConfirm={() => void confirmDelete()}
      onCancel={() => {
        if (!deleting) setDeletingAnswerId(null);
      }}
    />
    </>
  );
}
