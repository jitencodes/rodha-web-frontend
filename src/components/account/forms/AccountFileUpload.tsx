"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { AccountFieldShell } from "./AccountFieldShell";
import { cn } from "@/lib/utils";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,.jpg,.jpeg,.png";

type AccountFileUploadProps = {
  id?: string;
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  disabled?: boolean;
};

export function AccountFileUpload({
  id: idProp,
  label,
  file,
  onChange,
  required,
  error,
  helperText = "JPG/PNG, max 2 MB, face clearly visible, plain background.",
  disabled,
}: AccountFileUploadProps) {
  const autoId = useId();
  const id = idProp || autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function clearFile() {
    onChange(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setLocalError(undefined);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleFile(next: File | null) {
    if (!next) {
      clearFile();
      return;
    }
    const type = next.type.toLowerCase();
    if (type !== "image/jpeg" && type !== "image/png") {
      setLocalError("Only JPG or PNG files are allowed.");
      return;
    }
    if (next.size > MAX_BYTES) {
      setLocalError("File must be 2 MB or smaller.");
      return;
    }
    setLocalError(undefined);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(next);
    });
    onChange(next);
  }

  const displayError = error || localError;

  return (
    <AccountFieldShell
      id={id}
      label={label}
      required={required}
      error={displayError}
      helperText={helperText}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex min-h-[120px] w-full max-w-[160px] flex-col items-center justify-center gap-2 rounded-[var(--account-radius)] border border-dashed border-[var(--account-input-border)] bg-[var(--account-input-bg)] px-3 py-4 text-center transition-colors",
            "hover:border-[var(--account-accent)] hover:bg-[var(--account-accent)]/5",
            "focus:outline-none focus:ring-2 focus:ring-[var(--account-accent)]/20",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Passport preview"
              className="h-24 w-20 rounded object-cover"
            />
          ) : (
            <>
              <ImagePlus className="h-6 w-6 text-[var(--account-accent)]" />
              <span className="text-caption text-[var(--account-text-muted)]">
                Upload photo
              </span>
            </>
          )}
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-body-sm text-[var(--account-text)]">
            {file ? file.name : "No file selected"}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="rounded-[var(--account-radius)] border border-[var(--account-input-border)] px-3 py-1.5 text-body-sm font-medium text-[var(--account-text)] hover:border-[var(--account-accent)]"
            >
              Choose file
            </button>
            {file ? (
              <button
                type="button"
                disabled={disabled}
                onClick={clearFile}
                className="inline-flex items-center gap-1 rounded-[var(--account-radius)] px-3 py-1.5 text-body-sm text-red-500 hover:bg-red-500/10"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </AccountFieldShell>
  );
}
