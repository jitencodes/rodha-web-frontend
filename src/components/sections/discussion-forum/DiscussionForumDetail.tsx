"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import { ForumAvatar } from "@/components/sections/discussion-forum/ForumAvatar";
import { DiscussionForumShell } from "@/components/sections/discussion-forum/DiscussionForumShell";
import { ForumMessageComposer } from "@/components/sections/discussion-forum/ForumMessageComposer";
import { isForumRichTextEmpty } from "@/components/sections/discussion-forum/ForumRichTextEditor";
import {
  FORUM_PREVIEW_ANSWERS,
  FORUM_PREVIEW_QUESTIONS,
  formatForumCount,
  formatForumRelativeTime,
  type ForumPreviewAnswer,
} from "@/data/discussion-forum";
import { cn } from "@/lib/utils";

type DiscussionForumDetailProps = {
  questionId: number;
  basePath?: string;
};

function VoteColumn({
  score,
  onUp,
  onDown,
}: {
  score: number;
  onUp: () => void;
  onDown: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1">
      <button
        type="button"
        onClick={onUp}
        className="rounded-md p-1 text-text-dimmed transition-colors hover:bg-orange-500/10 hover:text-orange-400"
        aria-label="Upvote"
      >
        <ChevronUp className="size-5" />
      </button>
      <span className="min-w-8 text-center text-body font-semibold tabular-nums text-orange-400">
        {formatForumCount(score)}
      </span>
      <button
        type="button"
        onClick={onDown}
        className="rounded-md p-1 text-text-dimmed transition-colors hover:bg-bg-hover hover:text-text-secondary"
        aria-label="Downvote"
      >
        <ChevronDown className="size-5" />
      </button>
    </div>
  );
}

export function DiscussionForumDetail({
  questionId,
  basePath = "/discussion-forum",
}: DiscussionForumDetailProps) {
  const question = useMemo(
    () => FORUM_PREVIEW_QUESTIONS.find((item) => item.id === questionId) ?? null,
    [questionId]
  );

  const [answers, setAnswers] = useState<ForumPreviewAnswer[]>(
    () => FORUM_PREVIEW_ANSWERS[questionId] ?? []
  );
  const [questionVotes, setQuestionVotes] = useState(question?.voteScore ?? 0);

  if (!question) {
    return (
      <DiscussionForumShell basePath={basePath} hideComposer>
        <p className="text-body-sm text-text-muted">Question not found in preview data.</p>
        <Link
          href={basePath}
          className="mt-4 inline-flex items-center gap-1.5 text-body-sm text-orange-400 hover:text-orange-300"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to feed
        </Link>
      </DiscussionForumShell>
    );
  }

  return (
    <DiscussionForumShell basePath={basePath} hideComposer>
      <Link
        href={basePath}
        className="mb-3 inline-flex h-9 items-center gap-1.5 px-1 text-body-sm text-text-muted transition-colors hover:text-orange-400"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to feed
      </Link>

      <article className="rounded-2xl border border-border-default bg-bg-surface p-4 sm:p-6">
        <div className="flex gap-3 sm:gap-4">
          <VoteColumn
            score={questionVotes}
            onUp={() => setQuestionVotes((n) => n + 1)}
            onDown={() => setQuestionVotes((n) => n - 1)}
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-h3 font-semibold tracking-tight text-text-primary">
              {question.title}
            </h2>
            <div
              className="mt-3 space-y-2 text-body-sm leading-relaxed text-text-secondary [&_p]:mb-2"
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
          </div>
        </div>
      </article>

      <h3 className="mt-6 text-h4 font-semibold text-text-primary">
        {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
      </h3>

      <div className="mt-3 space-y-3">
        {answers.map((answer) => (
          <article
            key={answer.id}
            className={cn(
              "rounded-2xl border border-border-default bg-bg-surface p-4 sm:p-5",
              answer.isAccepted && "border-accent-green/40 bg-accent-green/5"
            )}
          >
            <div className="flex gap-3 sm:gap-4">
              <VoteColumn
                score={answer.voteScore}
                onUp={() =>
                  setAnswers((prev) =>
                    prev.map((item) =>
                      item.id === answer.id
                        ? { ...item, voteScore: item.voteScore + 1 }
                        : item
                    )
                  )
                }
                onDown={() =>
                  setAnswers((prev) =>
                    prev.map((item) =>
                      item.id === answer.id
                        ? { ...item, voteScore: item.voteScore - 1 }
                        : item
                    )
                  )
                }
              />
              <div className="min-w-0 flex-1">
                {answer.isAccepted ? (
                  <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-accent-green/35 bg-accent-green/10 px-2.5 py-0.5 text-caption font-medium text-accent-green">
                    <BadgeCheck className="size-3.5" aria-hidden />
                    Accepted answer
                  </p>
                ) : null}
                <div
                  className="space-y-2 text-body-sm leading-relaxed text-text-secondary [&_p]:mb-2"
                  dangerouslySetInnerHTML={{ __html: answer.content }}
                />
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
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="mb-3 text-body font-semibold text-text-primary">Your answer</h4>
        <ForumMessageComposer
          placeholder="Write an answer..."
          submitLabel="Post Answer"
          onSubmit={async ({ html }) => {
            if (isForumRichTextEmpty(html)) {
              toast.error("Write an answer before posting.");
              throw new Error("Empty answer");
            }
            const next: ForumPreviewAnswer = {
              id: Date.now(),
              topicId: question.id,
              content: html,
              voteScore: 0,
              isAccepted: false,
              createdAt: new Date().toISOString(),
              editedAt: null,
              author: {
                id: "you",
                fullName: "You",
                profilePicturePath: null,
                reputation: 0,
              },
              reactionTypeCount: { like: 0, dislike: 0 },
            };
            setAnswers((prev) => [...prev, next]);
            toast.success("Answer added to preview.");
          }}
        />
      </div>
    </DiscussionForumShell>
  );
}
