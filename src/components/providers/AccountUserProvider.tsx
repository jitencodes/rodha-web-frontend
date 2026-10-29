"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Provider, useAtomValue, useSetAtom } from "jotai";
import { createStore } from "jotai/vanilla";
import { userHasState } from "@/lib/api/modules/auth/mapper";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import { detectCurrentState } from "@/lib/geo/detect-current-state";
import { getGoogleMapsApiKey } from "@/lib/constants";
import { detectedLocationAtom, userAtom } from "@/lib/store/user";

function HydrateUser({
  user,
  children,
}: {
  user: AuthUserViewModel | null;
  children: ReactNode;
}) {
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
}

function DetectCurrentState() {
  const user = useAtomValue(userAtom);
  const setDetected = useSetAtom(detectedLocationAtom);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    if (!getGoogleMapsApiKey()) return;
    if (!user || userHasState(user)) return;
    started.current = true;
    void detectCurrentState().then((location) => {
      if (location) setDetected(location);
    });
  }, [user, setDetected]);

  return null;
}

/** Jotai provider for account routes — seeds `userAtom` from `/auth/me`. */
export function AccountUserProvider({
  user,
  children,
}: {
  user: AuthUserViewModel | null;
  children: ReactNode;
}) {
  const storeRef = useRef<ReturnType<typeof createStore> | null>(null);
  if (!storeRef.current) {
    storeRef.current = createStore();
    storeRef.current.set(userAtom, user);
  }

  return (
    <Provider store={storeRef.current}>
      <HydrateUser user={user}>
        <DetectCurrentState />
        {children}
      </HydrateUser>
    </Provider>
  );
}
