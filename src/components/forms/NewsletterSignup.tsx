"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { submitLead } from "@/lib/submit-lead";

interface NewsletterSignupProps {
  className?: string;
}

export function NewsletterSignup({ className }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    setErrorMessage("");

    const result = await submitLead({
      formType: "newsletter",
      email,
    });

    setLoading(false);

    if (!result.ok) {
      setStatus("error");
      setErrorMessage(result.error || "Unable to subscribe right now.");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-base flex-1"
        />
        <Button type="submit" loading={loading} size="md">
          Subscribe
        </Button>
      </form>
      {status === "success" && (
        <p className="mt-2 text-caption text-green-400">You&apos;re subscribed. Thank you!</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-caption text-red-400">{errorMessage}</p>
      )}
    </div>
  );
}
