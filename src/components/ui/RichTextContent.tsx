import { toSafeRichHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

interface RichTextContentProps {
  /** Editor HTML from the CMS (plain text is also accepted). */
  html: string | null | undefined;
  /**
   * - `light`: public website on white / beige sections
   * - `account`: account shell, follows `--account-*` theme tokens
   */
  variant?: "light" | "account";
  className?: string;
}

/**
 * Renders CMS editor content (paragraphs, lists, links, headings) with
 * site-themed typography. Renders nothing for empty content.
 */
export function RichTextContent({
  html,
  variant = "light",
  className,
}: RichTextContentProps) {
  const safeHtml = toSafeRichHtml(html);
  if (!safeHtml) return null;

  return (
    <div
      className={cn(
        "rich-text",
        variant === "account" && "rich-text--account",
        className
      )}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
