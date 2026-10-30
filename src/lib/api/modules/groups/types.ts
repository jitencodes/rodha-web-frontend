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
  createdBy: DoubtForumCreatorViewModel | null;
}

/** Detail payload from `GET api/app/groups/:id` (includes members). */
export interface GroupDetailViewModel extends DoubtForumViewModel {
  members: GroupMemberViewModel[];
}

/** `GET api/app/groups/:groupId/membership` */
export interface GroupMembershipApi {
  groupId?: number | null;
  groupName?: string | null;
  groupType?: string | null;
  isArchived?: boolean | null;
  isMember?: boolean | null;
  leftAt?: string | null;
}

export interface GroupMembershipViewModel {
  groupId: number;
  groupName: string;
  groupType: string | null;
  isArchived: boolean;
  isMember: boolean;
  leftAt: string | null;
}

export interface GetAppGroupsParams {
  page?: number;
  limit?: number;
  accessToken?: string;
}

export interface DoubtForumListViewModel {
  items: DoubtForumViewModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetDoubtForumsParams {
  page?: number;
  limit?: number;
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
}

export interface ForumTopicListViewModel {
  items: ForumTopicViewModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetForumTopicsParams {
  page?: number;
  limit?: number;
}

export interface GetForumMessagesParams {
  groupId: number;
  groupSlug: string;
  topicSlug: string;
  page?: number;
  limit?: number;
  accessToken?: string;
}

/** Channel / group chat wall — `group_id` only (no topic). */
export interface GetGroupMessagesParams {
  groupId: number;
  page?: number;
  limit?: number;
  accessToken?: string;
}

export interface GetGroupDetailParams {
  groupId: number;
  accessToken?: string;
  /** When set, reject details whose `type` does not match (e.g. group_chat). */
  expectedType?: string;
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
  /**
   * Required for doubt_forum answers. Omit for group_chat / broadcast wall posts
   * (`POST api/app/groups/messages` with `group_id` only).
   */
  topicSlug?: string | null;
  content: string;
  /** Forum threaded replies only — omit for group_chat. */
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
}

export interface ForumMessageListViewModel {
  items: ForumMessageViewModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
