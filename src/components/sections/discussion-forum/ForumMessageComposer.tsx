"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { Paperclip, Send, X } from "lucide-react";
import { toast } from "sonner";

import {
  ForumRichTextEditor,
  isForumRichTextEmpty,
} from "@/components/sections/discussion-forum/ForumRichTextEditor";
import { cn } from "@/lib/utils";

type ForumMessageComposerProps = {
  placeholder?: string;
  submitLabel?: string;
  className?: string;
  /** `compact` = single-line chat bar (groups/channels). Default = rich answer editor. */
  variant?: "rich" | "compact";
  onDraftChange?: (html: string) => void;
  onSubmit?: (payload: { html: string; files: File[] }) => void | Promise<void>;
};

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Portal-style rich answer/discussion composer (posts via parent onSubmit). */
export function ForumMessageComposer({
  placeholder = "Write an answer...",
  submitLabel = "Post Answer",
  className,
  variant = "rich",
  onDraftChange,
  onSubmit,
}: ForumMessageComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const isCompact = variant === "compact";
  const hasContent = isCompact
    ? content.trim().length > 0
    : !isForumRichTextEmpty(content);
  const canSend = !sending && (hasContent || files.length > 0);

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!selected.length) return;

    const invalidSize = selected.find((file) => file.size > MAX_FILE_BYTES);
    if (invalidSize) {
      toast.error(`${invalidSize.name} exceeds the 10 MB file limit.`);
      return;
    }

    setFiles((current) => {
      const existingKeys = new Set(
        current.map((file) => `${file.name}:${file.size}:${file.lastModified}`)
      );
      const next = [...current];
      for (const file of selected) {
        const key = `${file.name}:${file.size}:${file.lastModified}`;
        if (!existingKeys.has(key) && next.length < MAX_FILES) {
          next.push(file);
          existingKeys.add(key);
        }
      }
      if (current.length + selected.length > MAX_FILES) {
        toast.info(`You can attach a maximum of ${MAX_FILES} files.`);
      }
      return next;
    });
  };

  const handleSend = async () => {
    if (!canSend) return;
    try {
      setSending(true);
      // Compact chat bar sends plain text (group_chat API). Rich editor sends HTML.
      await onSubmit?.({ html: content.trim(), files });
      setContent("");
      setFiles([]);
      onDraftChange?.("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to post.");
    } finally {
      setSending(false);
    }
  };

  const onCompactKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  if (isCompact) {
    return (
      <div className={cn("space-y-2", className)}>
        {files.length ? (
          <div className="flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${file.lastModified}`}
                className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-caption text-text-secondary"
              >
                <Paperclip className="size-3.5 shrink-0 text-text-dimmed" />
                <span className="max-w-56 truncate" title={file.name}>
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFiles((current) =>
                      current.filter((_, i) => i !== index)
                    )
                  }
                  className="rounded p-0.5 text-text-dimmed hover:bg-bg-hover hover:text-text-primary"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex items-center gap-2 rounded-xl border border-border-default bg-bg-tertiary/60 px-2.5 py-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={handleFilesSelected}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,audio/*,video/*"
          />
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-hover hover:text-text-primary disabled:opacity-50"
            disabled={sending || files.length >= MAX_FILES}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach files"
          >
            <Paperclip className="size-4.5" />
          </button>
          <input
            type="text"
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              onDraftChange?.(event.target.value);
            }}
            onKeyDown={onCompactKeyDown}
            disabled={sending}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-body-sm text-text-primary outline-none placeholder:text-text-dimmed"
          />
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white transition-colors hover:bg-orange-400 disabled:opacity-40"
            disabled={!canSend}
            onClick={() => void handleSend()}
            aria-label={sending ? "Sending" : submitLabel}
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border-default bg-bg-surface shadow-sm",
        className
      )}
    >
      {files.length ? (
        <div className="flex flex-wrap gap-2 border-b border-border-subtle px-3 py-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border-default bg-bg-tertiary px-2.5 py-1.5 text-caption text-text-secondary"
            >
              <Paperclip className="size-3.5 shrink-0 text-text-dimmed" />
              <span className="max-w-56 truncate" title={file.name}>
                {file.name}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFiles((current) => current.filter((_, i) => i !== index))
                }
                className="rounded p-0.5 text-text-dimmed hover:bg-bg-hover hover:text-text-primary"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="p-2">
        <ForumRichTextEditor
          value={content}
          onChange={(value) => {
            setContent(value);
            onDraftChange?.(value);
          }}
          disabled={sending}
          placeholder={placeholder}
          minHeight={88}
        />

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              hidden
              onChange={handleFilesSelected}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*,audio/*,video/*"
            />
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-body-sm text-text-muted transition-colors hover:bg-bg-hover hover:text-text-primary disabled:opacity-50"
              disabled={sending || files.length >= MAX_FILES}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="size-4" />
              Attach files
            </button>
            <span className="text-[11px] text-text-dimmed">
              {files.length}/{MAX_FILES} files · 10 MB each
            </span>
          </div>

          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2 rounded-[6px] px-3.5 py-2 text-body-sm font-semibold disabled:opacity-50"
            disabled={!canSend}
            onClick={() => void handleSend()}
          >
            <Send className="size-4" />
            {sending ? "Sending…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
