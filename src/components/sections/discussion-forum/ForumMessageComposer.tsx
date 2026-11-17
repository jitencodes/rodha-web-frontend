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
  onDraftChange?: (html: string) => void;
  onSubmit?: (payload: { html: string; files: File[] }) => void | Promise<void>;
};

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Light rich-text reply composer with attachments (posts via parent `onSubmit`). */
export function ForumMessageComposer({
  placeholder = "Write a reply...",
  submitLabel = "Post Reply",
  className,
  onDraftChange,
  onSubmit,
}: ForumMessageComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);

  const canSend = !sending && (!isForumRichTextEmpty(content) || files.length > 0);

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
      onDraftChange?.("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to post.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-[8px] border border-neutral-200 bg-white shadow-sm",
        className
      )}
    >
      {files.length ? (
        <div className="flex flex-wrap gap-2 border-b border-neutral-100 px-3 py-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="inline-flex max-w-full items-center gap-2 rounded-[6px] border border-section-beige bg-section-cream px-2.5 py-1.5 text-caption text-neutral-700"
            >
              <Paperclip className="size-3.5 shrink-0 text-neutral-500" aria-hidden />
              <span className="max-w-56 truncate" title={file.name}>
                {file.name}
              </span>
              <button
                type="button"
                onClick={() =>
                  setFiles((current) => current.filter((_, i) => i !== index))
                }
                className="rounded p-0.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-3.5" aria-hidden />
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

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-2">
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
              className="inline-flex items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-body-sm text-neutral-600 transition-colors hover:bg-section-beige hover:text-orange-600 disabled:opacity-50"
              disabled={sending || files.length >= MAX_FILES}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="size-4" aria-hidden />
              Attach files
            </button>
            <span className="text-caption text-neutral-500">
              {files.length}/{MAX_FILES} files · 10 MB each
            </span>
          </div>

          <button
            type="button"
            className="btn-primary inline-flex items-center gap-2 rounded-[6px] px-3.5 py-2 text-body-sm font-semibold disabled:opacity-50"
            disabled={!canSend}
            onClick={() => void handleSend()}
          >
            <Send className="size-4" aria-hidden />
            {sending ? "Sending…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
