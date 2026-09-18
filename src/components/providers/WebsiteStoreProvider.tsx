"use client";

import { useEffect, useRef } from "react";
import { Provider } from "jotai";
import { createStore } from "jotai/vanilla";

import { categoriesAtom } from "@/lib/store/categories";
import type { WebsiteCategoryViewModel } from "@/lib/api/modules/categories/types";

interface WebsiteStoreProviderProps {
  categories: WebsiteCategoryViewModel[];
  children: React.ReactNode;
}

export function WebsiteStoreProvider({
  categories,
  children,
}: WebsiteStoreProviderProps) {
  const storeRef = useRef<ReturnType<typeof createStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createStore();
    storeRef.current.set(categoriesAtom, categories);
  }

  useEffect(() => {
    storeRef.current?.set(categoriesAtom, categories);
  }, [categories]);

  return (
    <Provider store={storeRef.current}>
      {children}
    </Provider>
  );
}