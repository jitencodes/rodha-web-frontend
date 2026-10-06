"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Provider, useSetAtom } from "jotai";
import { createStore } from "jotai/vanilla";
import type { AuthUserViewModel } from "@/lib/api/modules/auth/types";
import { userAtom } from "@/lib/store/user";

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
      <HydrateUser user={user}>{children}</HydrateUser>
    </Provider>
  );
}
