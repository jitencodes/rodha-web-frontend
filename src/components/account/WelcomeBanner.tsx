import Image from "next/image";
import { cn } from "@/lib/utils";
import type { DashboardWelcome } from "@/lib/account/types";

type WelcomeBannerProps = {
  welcome: DashboardWelcome;
  firstName: string;
  className?: string;
};

export function WelcomeBanner({
  welcome,
  firstName,
  className,
}: WelcomeBannerProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[var(--account-radius)] border border-[var(--account-border)]",
        className
      )}
      style={{
        background:
          "linear-gradient(105deg, var(--account-welcome-from) 0%, var(--account-welcome-to) 55%, var(--account-welcome-from) 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 30%, rgba(249,115,22,0.18) 0, transparent 42%), radial-gradient(circle at 72% 20%, rgba(249,115,22,0.12) 0, transparent 35%), radial-gradient(circle at 88% 70%, rgba(249,115,22,0.1) 0, transparent 40%)",
        }}
      />

      <div className="relative flex flex-col items-stretch gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-7">
        <div className="min-w-0 max-w-xl">
          <h1 className="font-montserrat text-[1.5rem] leading-tight font-bold tracking-tight text-[var(--account-text)] sm:text-[1.75rem]">
            {welcome.greetingPrefix}{" "}
            <span className="text-[var(--account-accent)]">{firstName}!</span>
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--account-text-secondary)] sm:text-[15px]">
            {welcome.message}
          </p>
        </div>

        {welcome.illustrationSrc ? (
          <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
            <span
              className="pointer-events-none absolute inset-[-12%] rounded-full border border-[var(--account-accent)]/25"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute inset-[-22%] rounded-full border border-[var(--account-accent)]/15"
              aria-hidden
            />
            <Image
              src={welcome.illustrationSrc}
              alt=""
              fill
              className="object-contain drop-shadow-md"
              sizes="144px"
              priority
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
