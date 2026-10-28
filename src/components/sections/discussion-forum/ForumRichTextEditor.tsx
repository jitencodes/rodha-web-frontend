"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import "quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type ForumRichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
  disabled?: boolean;
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function isHtmlEmpty(html: string): boolean {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length === 0;
}

export function isForumRichTextEmpty(html: string): boolean {
  return isHtmlEmpty(html);
}

/** Quill snow editor matching portal discussion composer toolbar. */
export function ForumRichTextEditor({
  value,
  onChange,
  placeholder = "Write an answer...",
  className,
  minHeight = 120,
  disabled = false,
}: ForumRichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "formula", "table"],
          ["clean"],
        ],
        handlers: {
          link(this: { quill: { getSelection: (f?: boolean) => { index: number; length: number } | null; getText: (i: number, l: number) => string; format: (n: string, v: unknown) => void } }, value: boolean) {
            const quill = this.quill;
            if (!value) {
              quill.format("link", false);
              return;
            }
            const range = quill.getSelection(true);
            if (!range) return;
            const preview = range.length ? quill.getText(range.index, range.length) : "";
            const url = window.prompt("Enter link URL", preview.startsWith("http") ? preview : "https://");
            if (url) quill.format("link", url);
          },
          image(this: {
            quill: {
              getSelection: (f?: boolean) => { index: number } | null;
              getLength: () => number;
              insertEmbed: (i: number, type: string, url: string, source: string) => void;
              setSelection: (i: number, l: number, source?: string) => void;
            };
          }) {
            const quill = this.quill;
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = () => {
              const file = input.files?.[0];
              if (!file) return;
              if (file.size > MAX_IMAGE_BYTES) {
                toast.error("Image must be 5 MB or smaller.");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => {
                const dataUrl = String(reader.result ?? "");
                if (!dataUrl) return;
                const range = quill.getSelection(true);
                const index = range?.index ?? quill.getLength();
                quill.insertEmbed(index, "image", dataUrl, "user");
                quill.setSelection(index + 1, 0, "user");
              };
              reader.readAsDataURL(file);
            };
            input.click();
          },
          formula(this: {
            quill: {
              getSelection: (f?: boolean) => { index: number } | null;
              getLength: () => number;
              insertText: (i: number, text: string, source: string) => void;
              setSelection: (i: number, l: number, source?: string) => void;
            };
          }) {
            const latex = window.prompt("Enter LaTeX formula");
            if (!latex?.trim()) return;
            const quill = this.quill;
            const range = quill.getSelection(true);
            const index = range?.index ?? quill.getLength();
            const snippet = `\\(${latex.trim()}\\)`;
            quill.insertText(index, snippet, "user");
            quill.setSelection(index + snippet.length, 0, "user");
          },
          table(this: {
            quill: {
              getSelection: (f?: boolean) => { index: number } | null;
              getLength: () => number;
              clipboard: { dangerouslyPasteHTML: (i: number, html: string) => void };
              setSelection: (i: number, l: number, source?: string) => void;
            };
          }) {
            const quill = this.quill;
            const range = quill.getSelection(true);
            const index = range?.index ?? Math.max(0, quill.getLength() - 1);
            quill.clipboard.dangerouslyPasteHTML(
              index,
              "<table><tbody><tr><td>Cell</td><td>Cell</td></tr><tr><td>Cell</td><td>Cell</td></tr></tbody></table><p><br/></p>"
            );
            quill.setSelection(index + 1, 0, "user");
          },
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "link",
    "image",
  ];

  return (
    <div
      className={cn("forum-rich-text", disabled && "pointer-events-none opacity-60", className)}
      style={
        {
          ["--forum-quill-min-h" as string]: `${minHeight}px`,
        } as React.CSSProperties
      }
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        readOnly={disabled}
      />
    </div>
  );
}
