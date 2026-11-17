export interface DoubtForumUserApi {
  id?: string;
  fullName?: string | null;
  email?: string | null;
  profilePicturePath?: string | null;
  userType?: string | null;
}

export interface DoubtForumApi {
  id: number;
  name?: string | null;
  description?: string | null;
  type?: string | null;
  groupIcon?: string | null;
  seoSlug?: string | null;
  isArchived?: boolean | null;
  deletedAt?: string | null;
  lastActivityAt?: string | null;
  lastMessagePreview?: string | null;
  memberCount?: number | null;
  topicCount?: number | null;
  isMember?: boolean | null;
  /** 🆕 Proposed (docs/discussion-api-gaps.md): admin-pinned homepage group. */
  isFeatured?: boolean | null;
  createdByUser?: DoubtForumUserApi | null;
  /** Present on `GET api/app/groups/:id` detail. */
  members?: GroupMemberApi[] | null;
}

export interface DoubtForumListApi {
  items?: DoubtForumApi[] | null;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } | null;
}

export interface DoubtForumCreatorViewModel {
  id: string;
  fullName: string;
  role: string;
}

export interface DoubtForumViewModel {
  id: number;
  name: string;
  description: string;
  slug: string;
  iconUrl: string | null;
  memberCount: number;
  topicCount: number;
  lastActivityAt: string | null;
  lastMessagePreview: string | null;
  type: string | null;
  isMember: boolean;
  isFeatured: boolean;
  createdBy: DoubtForumCreatorViewModel | null;
}

/** Detail payload from `GET api/app/groups/:id` (includes members). */
export interface GroupDetailViewModel extends DoubtForumViewModel {
  members: GroupMemberViewModel[];
}

export interface DoubtForumListViewModel {
  items: DoubtForumViewModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** `GET api/app/groups` — `sort_by` values accepted by the live API. */
export type DoubtForumSortBy =
  | "name"
  | "createdAt"
  | "updatedAt"
  | "lastActivityAt";

export interface GetDoubtForumsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: DoubtForumSortBy;
  sortOrder?: "asc" | "desc";
}

export interface ForumTopicAuthorApi {
  id?: string;
  fullName?: string | null;
  profilePicturePath?: string | null;
  userType?: string | null;
}

export interface ForumTopicLastMessageApi {
  id?: number;
  content?: string | null;
  createdAt?: string | null;
  user?: ForumTopicAuthorApi | null;
  reactionCount?: number | null;
  attachmentCount?: number | null;
  directReplyCount?: number | null;
}

export interface ForumTopicApi {
  id: number;
  groupId?: number | null;
  title?: string | null;
  slug?: string | null;
  content?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoSlug?: string | null;
  messageCount?: number | null;
  replyCount?: number | null;
  lastActivityAt?: string | null;
  lastMessageId?: number | null;
  lastMessagePreview?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  author?: ForumTopicAuthorApi | null;
  lastMessage?: ForumTopicLastMessageApi | null;
  /** 🆕 Proposed: topic-level likes (docs/discussion-api-gaps.md). */
  reactionTypeCount?: { like?: number | null; dislike?: number | null } | null;
  /** 🆕 Proposed: topic view counter. */
  viewCount?: number | null;
}

export interface ForumTopicListApi {
  items?: ForumTopicApi[] | null;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } | null;
}

export interface ForumTopicAuthorViewModel {
  id: string;
  fullName: string;
  profilePicturePath: string | null;
}

/** Latest reply on a topic (`lastMessage`). Drives the "Last post" column. */
export interface ForumTopicLastPostViewModel {
  authorName: string;
  createdAt: string;
}

export interface ForumTopicViewModel {
  id: number;
  groupId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  replyCount: number;
  lastActivityAt: string | null;
  createdAt: string;
  author: ForumTopicAuthorViewModel;
  lastMessagePreview: string | null;
  lastPost: ForumTopicLastPostViewModel | null;
  /** Null until the backend returns topic-level reactions. */
  likeCount: number | null;
  /** Null until the backend returns a view counter. */
  viewCount: number | null;
}

export interface ForumTopicListViewModel {
  items: ForumTopicViewModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** `GET api/app/groups/:ref/topics` — `sort_by` values accepted by the live API. */
export type ForumTopicSortBy =
  | "lastActivityAt"
  | "createdAt"
  | "title"
  | "messageCount";

export interface GetForumTopicsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: ForumTopicSortBy;
  sortOrder?: "asc" | "desc";
}

export interface GetForumMessagesParams {
  groupId: number;
  groupSlug: string;
  topicSlug: string;
  /** Omit for top-level posts; set to load the direct replies of that message. */
  parentMessageId?: number | null;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  accessToken?: string;
}

export interface GroupMemberUserApi {
  id?: string | null;
  fullName?: string | null;
  email?: string | null;
  profilePicturePath?: string | null;
  userType?: string | null;
  isActive?: boolean | null;
}

export interface GroupMemberRoleApi {
  id?: number | null;
  name?: string | null;
  label?: string | null;
}

export interface GroupMemberApi {
  id?: number | string | null;
  groupId?: number | null;
  userId?: string | null;
  role?: string | GroupMemberRoleApi | null;
  roleName?: string | null;
  memberRole?: string | null;
  userType?: string | null;
  email?: string | null;
  fullName?: string | null;
  profilePicturePath?: string | null;
  leftAt?: string | null;
  user?: GroupMemberUserApi | null;
}

export interface GroupMemberViewModel {
  id: string;
  fullName: string;
  role: string;
  email: string | null;
  profilePicturePath: string | null;
}

export interface CreateForumTopicParams {
  groupId: number;
  title: string;
  content: string;
}

export interface PostForumMessageParams {
  groupId: number;
  topicSlug: string;
  content: string;
  /** Threaded reply target; omit for a top-level reply. */
  parentMessageId?: number | null;
  files?: File[];
}

export interface UpdateForumMessageParams {
  messageId: number;
  content: string;
}

export type ForumReactionType = "like" | "dislike";

export interface ReactToForumMessageParams {
  messageId: number;
  reactionType: ForumReactionType;
}

export interface ForumMessageReactionResultApi {
  action?: string | null;
  reaction?: ForumMessageReactionApi | null;
  message?: ForumMessageApi | null;
}

export interface ForumMessageReactionResultViewModel {
  action: string;
  /** Null when DELETE returns no message payload — client clears `myReaction` locally. */
  message: ForumMessageViewModel | null;
}

export interface ForumMessageAttachmentApi {
  id?: number | null;
  filePath?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  createdAt?: string | null;
}

export interface ForumMessageReactionApi {
  id?: number | null;
  reactionTypeId?: number | null;
  userId?: string | null;
  createdAt?: string | null;
  user?: ForumTopicAuthorApi | null;
  reactionType?: {
    id?: number | null;
    key?: string | null;
    label?: string | null;
  } | null;
}

export interface ForumMessageApi {
  id: number;
  groupId?: number | null;
  groupTopicId?: number | null;
  parentMessageId?: number | null;
  content?: string | null;
  status?: string | null;
  editedAt?: string | null;
  deletedAt?: string | null;
  createdAt?: string | null;
  user?: ForumTopicAuthorApi | null;
  groupTopic?: {
    id?: number | null;
    title?: string | null;
    slug?: string | null;
  } | null;
  attachments?: ForumMessageAttachmentApi[] | null;
  reactionTypeCount?: {
    like?: number | null;
    dislike?: number | null;
  } | null;
  myReaction?: string | null;
  reactions?: ForumMessageReactionApi[] | null;
  replyCount?: number | null;
}

export interface ForumMessageListApi {
  items?: ForumMessageApi[] | null;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  } | null;
}

export interface ForumMessageAttachmentViewModel {
  id: number;
  filePath: string;
  fileName: string;
  mimeType: string;
  isImage: boolean;
}

export interface ForumMessageViewModel {
  id: number;
  content: string;
  createdAt: string;
  editedAt: string | null;
  author: ForumTopicAuthorViewModel;
  likeCount: number;
  dislikeCount: number;
  myReaction: ForumReactionType | null;
  attachments: ForumMessageAttachmentViewModel[];
  /** API status, e.g. active / moderated. */
  status: string | null;
  parentMessageId: number | null;
  replyCount: number;
}

export interface ForumMessageListViewModel {
  items: ForumMessageViewModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
