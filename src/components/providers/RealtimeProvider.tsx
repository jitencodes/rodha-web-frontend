"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  closeOpenGroupChat,
  connectRealtime,
  setPersonalHandlers,
} from "@/lib/realtime/socket";

/** One Socket.IO connection for the logged-in user, including personal group events. */
export function RealtimeProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setPersonalHandlers({
      onUserAdded: () => {
        router.refresh();
      },
      onUserRemoved: (groupId) => {
        closeOpenGroupChat(groupId);
        router.refresh();
      },
    });
    return () => setPersonalHandlers(null);
  }, [router]);

  useEffect(() => {
    void connectRealtime();
  }, [pathname]);

  return children;
}
