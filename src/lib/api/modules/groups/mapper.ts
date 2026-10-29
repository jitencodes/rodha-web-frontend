import type {
  DoubtForumApi,
  DoubtForumListApi,
  DoubtForumListViewModel,
  DoubtForumViewModel,
  ForumMessageApi,
  ForumMessageAttachmentApi,
  ForumMessageAttachmentViewModel,
  ForumMessageListApi,
  ForumMessageListViewModel,
  ForumMessageViewModel,
  ForumTopicApi,
  ForumTopicAuthorApi,
  ForumTopicAuthorViewModel,
  ForumTopicListApi,
  ForumTopicListViewModel,
  ForumTopicViewModel,
} from "./types";

function asCount(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.floor(value)
    : 0;
}

function asNonNegativeCount(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

function asHttpUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return null;
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }
  return null;
}

/** Strip tags / entities for card titles and excerpts. */
export function toForumPlainText(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function mapAuthor(
  author: ForumTopicAuthorApi | null | undefined
): ForumTopicAuthorViewModel {
  return {
    id: author?.id?.trim() || "",
    fullName: author?.fullName?.trim() || "Member",
    profilePicturePath: asHttpUrl(author?.profilePicturePath),
  };
}

export function mapDoubtForum(
  forum: DoubtForumApi
): DoubtForumViewModel | null {
  if (forum.isArchived || forum.deletedAt) return null;

  const name = forum.name?.trim() ?? "";
  if (!name || !Number.isFinite(forum.id)) return null;

  const slug = forum.seoSlug?.trim() || String(forum.id);

  return {
    id: forum.id,
    name,
    description: forum.description?.trim() ?? "",
    slug,
    iconUrl: asHttpUrl(forum.groupIcon),
    memberCount: asCount(forum.memberCount),
    topicCount: asCount(forum.topicCount),
    lastActivityAt: forum.lastActivityAt?.trim() || null,
  };
}

export function mapDoubtForums(
  items: DoubtForumApi[] | null | undefined
): DoubtForumViewModel[] {
  if (!items?.length) return [];

  return items
    .map(mapDoubtForum)
    .filter((item): item is DoubtForumViewModel => item !== null);
}

export function mapDoubtForumList(
  data: DoubtForumListApi | null | undefined
): DoubtForumListViewModel | null {
  if (!data) return null;

  const items = mapDoubtForums(data.items);
  const page = data.pagination?.page ?? 1;
  const limit = data.pagination?.limit ?? 20;
  const total = data.pagination?.total ?? items.length;
  const totalPages = data.pagination?.totalPages ?? (items.length ? 1 : 0);

  return {
    items,
    page,
    limit,
    total,
    totalPages,
  };
}

export function mapForumTopic(
  topic: ForumTopicApi,
  fallbackGroupId?: number
): ForumTopicViewModel | null {
  if (!Number.isFinite(topic.id)) return null;

  const title =
    toForumPlainText(topic.title) ||
    toForumPlainText(topic.seoTitle) ||
    "Untitled question";
  const rawContent = topic.content?.trim() || "";
  const excerpt =
    toForumPlainText(topic.content) ||
    toForumPlainText(topic.lastMessagePreview) ||
    toForumPlainText(topic.seoDescription);

  const groupId =
    typeof topic.groupId === "number" && Number.isFinite(topic.groupId)
      ? topic.groupId
      : fallbackGroupId ?? 0;

  const replyCount = asNonNegativeCount(
    topic.replyCount ?? topic.messageCount
  );

  return {
    id: topic.id,
    groupId,
    title,
    slug: topic.slug?.trim() || String(topic.id),
    content: rawContent,
    excerpt,
    replyCount,
    lastActivityAt: topic.lastActivityAt?.trim() || null,
    createdAt: topic.createdAt?.trim() || "",
    author: mapAuthor(topic.author),
    lastMessagePreview: toForumPlainText(topic.lastMessagePreview) || null,
  };
}

export function mapForumTopics(
  items: ForumTopicApi[] | null | undefined,
  fallbackGroupId?: number
): ForumTopicViewModel[] {
  if (!items?.length) return [];

  return items
    .map((item) => mapForumTopic(item, fallbackGroupId))
    .filter((item): item is ForumTopicViewModel => item !== null);
}

export function mapForumTopicList(
  data: ForumTopicListApi | null | undefined,
  fallbackGroupId?: number
): ForumTopicListViewModel | null {
  if (!data) return null;

  const items = mapForumTopics(data.items, fallbackGroupId);
  const page = data.pagination?.page ?? 1;
  const limit = data.pagination?.limit ?? 20;
  const total = data.pagination?.total ?? items.length;
  const totalPages = data.pagination?.totalPages ?? (items.length ? 1 : 0);

  return {
    items,
    page,
    limit,
    total,
    totalPages,
  };
}

function isImageMime(mimeType: string, fileName: string, filePath: string): boolean {
  if (mimeType.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|bmp|avif)($|\?)/i.test(fileName || filePath);
}

export function mapForumMessageAttachment(
  attachment: ForumMessageAttachmentApi
): ForumMessageAttachmentViewModel | null {
  const filePath = asHttpUrl(attachment.filePath);
  if (!filePath) return null;

  const fileName =
    attachment.fileName?.trim() ||
    filePath.split("/").pop()?.split("?")[0] ||
    "Attachment";
  const mimeType = attachment.mimeType?.trim() || "application/octet-stream";
  const id =
    typeof attachment.id === "number" && Number.isFinite(attachment.id)
      ? attachment.id
      : Number.NaN;

  return {
    id: Number.isFinite(id) ? id : filePath.length,
    filePath,
    fileName,
    mimeType,
    isImage: isImageMime(mimeType, fileName, filePath),
  };
}

export function mapForumMessage(
  message: ForumMessageApi
): ForumMessageViewModel | null {
  if (!Number.isFinite(message.id) || message.deletedAt) return null;
  if (message.status && message.status.toLowerCase() !== "active") return null;

  const attachments = (message.attachments ?? [])
    .map(mapForumMessageAttachment)
    .filter((item): item is ForumMessageAttachmentViewModel => item !== null);

  return {
    id: message.id,
    content: message.content?.trim() ?? "",
    createdAt: message.createdAt?.trim() || "",
    editedAt: message.editedAt?.trim() || null,
    author: mapAuthor(message.user),
    likeCount: asNonNegativeCount(message.reactionTypeCount?.like),
    dislikeCount: asNonNegativeCount(message.reactionTypeCount?.dislike),
    attachments,
  };
}

export function mapForumMessages(
  items: ForumMessageApi[] | null | undefined
): ForumMessageViewModel[] {
  if (!items?.length) return [];

  return items
    .map(mapForumMessage)
    .filter((item): item is ForumMessageViewModel => item !== null);
}

export function mapForumMessageList(
  data: ForumMessageListApi | null | undefined
): ForumMessageListViewModel | null {
  if (!data) return null;

  const items = mapForumMessages(data.items);
  const page = data.pagination?.page ?? 1;
  const limit = data.pagination?.limit ?? 20;
  const total = data.pagination?.total ?? items.length;
  const totalPages = data.pagination?.totalPages ?? (items.length ? 1 : 0);

  return {
    items,
    page,
    limit,
    total,
    totalPages,
  };
}
