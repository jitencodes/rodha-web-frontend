import type {
  DoubtForumApi,
  DoubtForumCreatorViewModel,
  DoubtForumListApi,
  DoubtForumListViewModel,
  DoubtForumUserApi,
  DoubtForumViewModel,
  ForumMessageApi,
  ForumMessageAttachmentApi,
  ForumMessageAttachmentViewModel,
  ForumMessageListApi,
  ForumMessageListViewModel,
  ForumMessageReactionResultApi,
  ForumMessageReactionResultViewModel,
  ForumMessageViewModel,
  ForumReactionType,
  ForumTopicApi,
  ForumTopicAuthorApi,
  ForumTopicAuthorViewModel,
  ForumTopicListApi,
  ForumTopicListViewModel,
  ForumTopicViewModel,
  GroupDetailViewModel,
  GroupMemberApi,
  GroupMemberRoleApi,
  GroupMemberViewModel,
  GroupMembershipApi,
  GroupMembershipViewModel,
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

function mapCreator(
  user: DoubtForumUserApi | null | undefined
): DoubtForumCreatorViewModel | null {
  const fullName = user?.fullName?.trim() ?? "";
  if (!fullName) return null;
  const role =
    user?.userType?.trim() ||
    (user?.email?.toLowerCase().includes("admin") ? "Admin" : "Member");
  return {
    id: user?.id?.trim() || "",
    fullName,
    role,
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
    lastMessagePreview: toForumPlainText(forum.lastMessagePreview) || null,
    type: forum.type?.trim() || null,
    isMember: forum.isMember === true,
    createdBy: mapCreator(forum.createdByUser),
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

export function mapMyReaction(
  value: string | null | undefined
): ForumReactionType | null {
  const key = value?.trim().toLowerCase() ?? "";
  if (key === "like" || key === "dislike") return key;
  return null;
}

export function mapForumMessage(
  message: ForumMessageApi
): ForumMessageViewModel | null {
  if (!Number.isFinite(message.id) || message.deletedAt) return null;

  const status = message.status?.trim().toLowerCase() || null;
  // Keep active + moderated in chat; hide other non-active statuses.
  if (status && status !== "active" && status !== "moderated") return null;

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
    myReaction: mapMyReaction(message.myReaction),
    attachments,
    status,
  };
}

export function mapForumMessageReactionResult(
  data: ForumMessageReactionResultApi | null | undefined
): ForumMessageReactionResultViewModel | null {
  if (!data?.message) return null;
  const message = mapForumMessage(data.message);
  if (!message) return null;
  return {
    action: data.action?.trim() || "",
    message,
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

function roleLabelFromApi(
  role: string | GroupMemberRoleApi | null | undefined
): string {
  if (!role) return "";
  if (typeof role === "string") return role.trim();
  return role.label?.trim() || role.name?.trim() || "";
}

function mapMemberRole(member: GroupMemberApi): string {
  const raw =
    roleLabelFromApi(member.role) ||
    member.roleName?.trim() ||
    member.memberRole?.trim() ||
    member.user?.userType?.trim() ||
    member.userType?.trim() ||
    "";
  if (!raw) return "Member";
  const key = raw.toLowerCase();
  if (key.includes("admin")) return "Admin";
  if (key.includes("mentor") || key.includes("teacher")) return "Mentor";
  if (key.includes("student")) return "Student";
  return raw;
}

export function mapGroupMember(
  member: GroupMemberApi
): GroupMemberViewModel | null {
  if (member.leftAt) return null;

  const user = member.user;
  const fullName =
    user?.fullName?.trim() || member.fullName?.trim() || "";
  if (!fullName) return null;

  const id =
    user?.id?.trim() ||
    member.userId?.trim() ||
    (member.id != null ? String(member.id) : "") ||
    fullName;

  return {
    id,
    fullName,
    role: mapMemberRole(member),
    email: user?.email?.trim() || member.email?.trim() || null,
    profilePicturePath:
      asHttpUrl(user?.profilePicturePath) ||
      asHttpUrl(member.profilePicturePath),
  };
}

export function mapGroupMembers(
  items: GroupMemberApi[] | null | undefined
): GroupMemberViewModel[] {
  if (!items?.length) return [];
  return items
    .map(mapGroupMember)
    .filter((item): item is GroupMemberViewModel => item !== null);
}

export function mapGroupDetail(
  data: DoubtForumApi | null | undefined
): GroupDetailViewModel | null {
  const base = data ? mapDoubtForum(data) : null;
  if (!base) return null;

  const members = mapGroupMembers(data?.members);
  return {
    ...base,
    memberCount: base.memberCount || members.length,
    members,
  };
}

export function mapGroupMembership(
  data: GroupMembershipApi | null | undefined
): GroupMembershipViewModel | null {
  if (!data) return null;
  const groupId = data.groupId;
  if (typeof groupId !== "number" || !Number.isFinite(groupId) || groupId <= 0) {
    return null;
  }

  return {
    groupId,
    groupName: data.groupName?.trim() || `Group ${groupId}`,
    groupType: data.groupType?.trim() || null,
    isArchived: data.isArchived === true,
    isMember: data.isMember === true,
    leftAt: data.leftAt?.trim() || null,
  };
}
