import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Health",
  robots: { index: false, follow: false },
};

export default function HealthPage() {
  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden overscroll-none bg-black px-4">
      <style>{`
        @keyframes health-glow {
          0%, 100% { transform: scale(0.94); opacity: 0.28; }
          50% { transform: scale(1.06); opacity: 0.5; }
        }
        @keyframes health-rise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes health-line {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>

      <div
        className="relative isolate flex flex-col items-center"
        style={{ animation: "health-rise 0.7s ease-out both" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-8 -z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/70 blur-3xl"
          style={{ animation: "health-glow 3.2s ease-in-out infinite" }}
        />
        <Link href="/" className="mb-5">
          <Image
            src="/assets/images/rodha-logo.webp"
            alt="Rodha"
            width={160}
            height={42}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>
        <p className="text-center font-montserrat text-2xl font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] sm:text-3xl">
          Website up and running
          <span
            aria-hidden
            className="mx-auto mt-3 block h-0.5 w-16 origin-left rounded-full bg-accent-green"
            style={{ animation: "health-line 0.8s 0.35s ease-out both" }}
          />
        </p>
      </div>
    </main>
  );
}
