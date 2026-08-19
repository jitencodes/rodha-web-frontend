"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

interface ShareBlogProps {
  url: string;
  title: string;
  className?: string;
}

function whatsappHref(url: string, title: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
}
function facebookHref(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}
function twitterHref(url: string, title: string) {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
}
function linkedinHref(url: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function ShareBlog({ url, title, className }: ShareBlogProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — noop on old browsers
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-h4 font-semibold text-neutral-900">Share this article</h3>
      <div className="flex items-center gap-2">
        {/* Copy link */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-section-beige bg-white text-neutral-500 hover:text-orange-600 hover:border-orange-300 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/30"
          aria-label={copied ? "Link copied" : "Copy link"}
        >
          {copied ? (
            <CheckIcon className="h-4.5 w-4.5 text-green-500" />
          ) : (
            <CopyIcon className="h-4.5 w-4.5" />
          )}
        </button>

        {/* WhatsApp */}
        <a
          href={whatsappHref(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-section-beige bg-white text-neutral-500 hover:text-green-600 hover:border-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/30"
          aria-label="Share on WhatsApp"
        >
          <WhatsAppIcon className="h-4.5 w-4.5" />
        </a>

        {/* Facebook */}
        <a
          href={facebookHref(url)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-section-beige bg-white text-neutral-500 hover:text-blue-600 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          aria-label="Share on Facebook"
        >
          <Icon src="/assets/icons/facebook.svg" size={18} />
        </a>

        {/* Twitter / X */}
        <a
          href={twitterHref(url, title)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-section-beige bg-white text-neutral-500 hover:text-neutral-800 hover:border-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500/30"
          aria-label="Share on X"
        >
          <Icon src="/assets/icons/twitter.svg" size={18} />
        </a>

        {/* LinkedIn */}
        <a
          href={linkedinHref(url)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-section-beige bg-white text-neutral-500 hover:text-blue-700 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          aria-label="Share on LinkedIn"
        >
          <Icon src="/assets/icons/linkedin.svg" size={18} />
        </a>
      </div>
    </div>
  );
}
