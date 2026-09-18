import type {
    FaqApi,
    FaqListApi,
    FaqListViewModel,
    FaqViewModel,
  } from "@/lib/api/modules/faqs/types";
  
  export function mapFaq(
    faq: FaqApi
  ): FaqViewModel | null {
    if (faq.isActive === false) return null;
  
    const question = faq.question?.trim();
    const answer = faq.answer?.trim();
  
    if (!question || !answer) return null;
  
    const category = faq.websiteCategory;
  
    return {
      id: String(faq.id),
      question,
      answer,
  
      category:
        category?.slug
          ? {
              id: String(category.id),
              name: category.name?.trim() || "",
              title: category.title?.trim() || "",
              slug: category.slug.trim(),
            }
          : null,
    };
  }
  
  export function mapFaqs(
    items: FaqApi[] | null | undefined
  ): FaqViewModel[] {
    if (!items?.length) return [];
  
    return items
      .map(mapFaq)
      .filter((item): item is FaqViewModel => item !== null);
  }
  
  export function mapFaqList(
    data: FaqListApi | null | undefined
  ): FaqListViewModel | null {
    if (!data) return null;
  
    return {
      items: mapFaqs(data.items),
  
      pagination: {
        page: data.pagination?.page ?? 1,
        limit: data.pagination?.limit ?? 10,
        total: data.pagination?.total ?? 0,
        totalPages: data.pagination?.totalPages ?? 1,
      },
    };
  }