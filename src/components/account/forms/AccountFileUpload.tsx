"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { AccountFieldShell } from "./AccountFieldShell";
import { cn } from "@/lib/utils";
import {
  PASSPORT_PHOTO_ACCEPT,
  PASSPORT_PHOTO_HELPER_TEXT,
  validatePassportPhoto,
} from "@/lib/account/passport-photo";

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
  helperText = PASSPORT_PHOTO_HELPER_TEXT,
  disabled,
}: AccountFileUploadProps) {
  const autoId = useId();
  const id = idProp || autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | undefined>();
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(
    null
  );

  // Preview follows the `file` prop, so a photo restored from a saved draft shows too.
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    const reader = new FileReader();
    reader.onload = () => {
      if (!cancelled && typeof reader.result === "string") {
        setPreview({ file, url: reader.result });
      }
    };
    reader.readAsDataURL(file);
    return () => {
      cancelled = true;
      if (reader.readyState === FileReader.LOADING) reader.abort();
    };
  }, [file]);
  const previewUrl = file && preview?.file === file ? preview.url : null;

  function resetInput() {
    // Lets the same file be picked again after an error or removal.
    if (inputRef.current) inputRef.current.value = "";
  }

  function clearFile() {
    onChange(null);
    setLocalError(undefined);
    resetInput();
  }

  function handleFile(next: File | null) {
    if (!next) {
      // Picker cancelled — keep the current photo.
      resetInput();
      return;
    }
    const problem = validatePassportPhoto(next);
    if (problem) {
      // Keep any previously accepted photo; just explain why this one was rejected.
      setLocalError(problem);
      resetInput();
      return;
    }
    setLocalError(undefined);
    onChange(next);
  }

  // A rejected pick is the most recent, specific message — show it over the form's.
  const displayError = localError || error;

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
        accept={PASSPORT_PHOTO_ACCEPT}
        className="sr-only"
        disabled={disabled}
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
    </AccountFieldShell>
  );
}
