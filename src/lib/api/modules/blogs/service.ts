import { apiGetOrNull } from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";

import {
  mapBlogDetail,
  mapBlogList,
} from "./mapper";

import type {
  BlogDetailApi,
  BlogDetailViewModel,
  BlogListApi,
  BlogListViewModel,
  GetBlogsParams,
} from "./types";

const PATH = "api/website/blogs";

export async function getBlogs(
  params: GetBlogsParams = {}
): Promise<BlogListViewModel | null> {
  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    search: params.search?.trim(),
    category:
      params.category && params.category !== "all"
        ? params.category.trim()
        : undefined,
  });

  const data = await apiGetOrNull<BlogListApi>(
    `${PATH}${query}`
  );

  return mapBlogList(data);
}

export async function getBlogBySlug(
  slug: string
): Promise<BlogDetailViewModel | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const data = await apiGetOrNull<BlogDetailApi>(
    `${PATH}/${encodeURIComponent(normalizedSlug)}`
  );

  return mapBlogDetail(data);
}