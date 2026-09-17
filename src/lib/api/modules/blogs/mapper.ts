import type {
    BlogApi,
    BlogDetailApi,
    BlogListApi,
    BlogListViewModel,
    BlogViewModel,
  } from "./types";
  
  function formatReadTime(minutes?: number | null): string {
    if (!minutes || minutes <= 0) {
      return "";
    }
  
    return `${minutes} min read`;
  }
  
  export function mapBlog(
    blog: BlogApi
  ): BlogViewModel | null {
    if (blog.isActive === false) {
      return null;
    }
  
    const title = blog.title?.trim();
    const slug = blog.slug?.trim();
  
    if (!title || !slug) {
      return null;
    }
  
    const category = blog.websiteCategory;
  
    const categoryName = category?.name?.trim() || "";
    const categoryTitle = category?.title?.trim() || "";
    const categorySlug = category?.slug?.trim() || "";
  
    const description = blog.description?.trim() || "";
  
    const publishedAt = blog.publishedAt || "";
  
    return {
      id: String(blog.id),
      title,
      slug,
      shortDescription: description,
      excerpt: description,
      content: blog.content || "",
      author: blog.author?.trim() || "",
      publishedDate: publishedAt,
      publishedAt,
      readTime: formatReadTime(blog.estimatedReadMinutes),
      thumbnail: blog.bannerImageUrl || "",
      image: blog.contentImageUrl || blog.bannerImageUrl || "",
      category: categoryName,
      categoryLabel: categoryTitle || categoryName,
      categorySlug,
      metaTitle: blog.metaTitle?.trim() || title,
      metaDescription:
        blog.metaDescription?.trim() || description,
      metaKeywords: Array.isArray(blog.metaKeywords)
        ? blog.metaKeywords.filter(
            (keyword): keyword is string =>
              typeof keyword === "string" && Boolean(keyword.trim())
          )
        : [],
    };
  }
  
  export function mapBlogs(
    items: BlogApi[] | null | undefined
  ): BlogViewModel[] {
    if (!items?.length) {
      return [];
    }
  
    return items
      .map(mapBlog)
      .filter(
        (item): item is BlogViewModel => item !== null
      );
  }
  
  export function mapBlogList(
    data: BlogListApi | null | undefined
  ): BlogListViewModel | null {
    if (!data) {
      return null;
    }
  
    return {
      items: mapBlogs(data.items),
      pagination: {
        page: data.pagination?.page ?? 1,
        limit: data.pagination?.limit ?? 10,
        total: data.pagination?.total ?? 0,
        totalPages: data.pagination?.totalPages ?? 1,
      },
    };
  }
  
  export function mapBlogDetail(
    data: BlogDetailApi | null | undefined
  ): BlogViewModel | null {
    if (!data?.blog) {
      return null;
    }
  
    return mapBlog(data.blog);
  }