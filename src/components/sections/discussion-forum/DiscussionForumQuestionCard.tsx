import Link from "next/link";
import { CheckCircle2, Eye, MessageCircle, ThumbsUp } from "lucide-react";

import { ForumAvatar } from "@/components/sections/discussion-forum/ForumAvatar";
import {
  formatForumCount,
  formatForumRelativeTime,
  type ForumPreviewQuestion,
} from "@/data/discussion-forum";
import { cn } from "@/lib/utils";

type DiscussionForumQuestionCardProps = {
  question: ForumPreviewQuestion;
  basePath?: string;
};

export function DiscussionForumQuestionCard({
  question,
  basePath = "/discussion-forum",
}: DiscussionForumQuestionCardProps) {
  return (
    <article className="rounded-2xl border border-border-default bg-bg-surface p-4 shadow-sm transition-all duration-200 hover:border-orange-500/35 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <ForumAvatar
            name={question.author.fullName}
            className="size-9"
            textClassName="text-xs"
          />
          <div className="min-w-0">
            <p className="truncate text-body-sm font-medium text-text-primary">
              {question.author.fullName}
            </p>
            <p className="truncate text-caption text-text-muted">
              asked {formatForumRelativeTime(question.createdAt)}
              {question.author.reputation != null ? (
                <span className="ml-1.5 tabular-nums">
                  · {formatForumCount(question.author.reputation)}
                </span>
              ) : null}
            </p>
          </div>
        </div>
        <span className="shrink-0 text-caption text-text-dimmed">
          {formatForumRelativeTime(question.lastActivityAt)}
        </span>
      </div>

      <h3 className="mt-3 text-body-lg font-semibold leading-snug tracking-tight text-text-primary">
        <Link
          href={`${basePath}/${question.id}`}
          className="transition-colors duration-200 hover:text-orange-400"
        >
          {question.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-2 text-body-sm leading-relaxed text-text-muted">
        {question.excerpt}
      </p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {question.tags.map((tag) => (
          <li key={tag}>
            <Link
              href={`${basePath}?tag=${encodeURIComponent(tag)}`}
              className="inline-flex items-center rounded-full border border-border-default bg-bg-tertiary px-2.5 py-0.5 text-caption font-medium text-text-secondary transition-colors duration-200 hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400"
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border-subtle pt-3 text-caption text-text-muted">
        <span className="inline-flex items-center gap-1.5 text-orange-400">
          <ThumbsUp className="size-3.5" aria-hidden />
          <strong className="tabular-nums">{formatForumCount(question.voteScore)}</strong>
          votes
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5",
            question.hasAcceptedAnswer && "font-medium text-accent-green"
          )}
        >
          {question.hasAcceptedAnswer ? (
            <CheckCircle2 className="size-3.5" aria-hidden />
          ) : (
            <MessageCircle className="size-3.5" aria-hidden />
          )}
          <strong className="tabular-nums">{formatForumCount(question.answerCount)}</strong>
          {question.answerCount === 1 ? "answer" : "answers"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Eye className="size-3.5" aria-hidden />
          <strong className="tabular-nums text-text-secondary">
            {formatForumCount(question.viewCount)}
          </strong>
          views
        </span>
      </div>
    </article>
  );
}
