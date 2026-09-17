import { atom } from "jotai";

import type { WebsiteCategoryViewModel } from "@/lib/api/modules/categories/types";

export const categoriesAtom = atom<WebsiteCategoryViewModel[]>([]);