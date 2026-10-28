"use client";

import { useRef, useState, type ChangeEvent } from "react";
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
  onSubmit?: (payload: { html: string; files: File[] }) => void | Promise<void>;
};

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Portal-style rich answer/discussion composer (preview — no API yet). */
export function ForumMessageComposer({
  placeholder = "Write an answer...",
  submitLabel = "Post Answer",
  className,
  onSubmit,
}: ForumMessageComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const hasContent = !isForumRichTextEmpty(content);
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
      await onSubmit?.({ html: content.trim(), files });
      setContent("");
      setFiles([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to post.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={cn("rounded-xl border border-border-default bg-bg-surface shadow-sm", className)}>
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
                onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
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
          onChange={setContent}
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
