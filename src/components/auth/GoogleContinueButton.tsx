"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { cn } from "@/lib/utils";

const GIS_SRC = "https://accounts.google.com/gsi/client";

interface GoogleContinueButtonProps {
  disabled?: boolean;
  onCredential: (idToken: string) => void;
  onError?: (message: string) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string;
              theme?: string;
              size?: string;
              width?: number;
              text?: string;
            }
          ) => void;
        };
      };
    };
  }
}

export function GoogleContinueButton({
  disabled,
  onCredential,
  onError,
}: GoogleContinueButtonProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);
  const [scriptReady, setScriptReady] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? "";

  onCredentialRef.current = onCredential;
  onErrorRef.current = onError;

  const renderButton = useCallback(() => {
    const parent = overlayRef.current;
    if (!clientId || !parent || !window.google?.accounts?.id) return;

    parent.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (response.credential) {
          onCredentialRef.current(response.credential);
          return;
        }
        onErrorRef.current?.("Google sign-in did not return a credential.");
      },
    });
    window.google.accounts.id.renderButton(parent, {
      type: "standard",
      theme: "outline",
      size: "large",
      width: Math.max(parent.offsetWidth, 240),
      text: "continue_with",
    });
  }, [clientId]);

  useEffect(() => {
    if (!scriptReady) return;
    renderButton();
  }, [scriptReady, renderButton]);

  return (
    <>
      <Script
        src={GIS_SRC}
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="relative w-full">
        <span
          className={cn(
            "inline-flex h-11 w-full items-center justify-center gap-2 rounded-[8px] border border-neutral-200 bg-white text-body-sm font-semibold text-neutral-800",
            (disabled || !clientId) && "opacity-50"
          )}
        >
          <GoogleMark />
          Continue with Google
        </span>
        {clientId ? (
          <div
            ref={overlayRef}
            className={cn(
              "absolute inset-0 overflow-hidden opacity-0",
              disabled && "pointer-events-none"
            )}
            aria-hidden
          />
        ) : (
          <button
            type="button"
            disabled
            className="absolute inset-0 cursor-not-allowed"
            aria-label="Google login is not configured"
            onClick={() =>
              onError?.(
                "Google login is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID."
              )
            }
          />
        )}
      </div>
    </>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.348 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
