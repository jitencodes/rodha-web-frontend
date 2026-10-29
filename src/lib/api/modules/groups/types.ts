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
  memberCount?: number | null;
  topicCount?: number | null;
  createdByUser?: DoubtForumUserApi | null;
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

export interface DoubtForumViewModel {
  id: number;
  name: string;
  description: string;
  slug: string;
  iconUrl: string | null;
  memberCount: number;
  topicCount: number;
  lastActivityAt: string | null;
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
  parentMessageId?: number | null;
  files?: File[];
}

export interface UpdateForumMessageParams {
  messageId: number;
  content: string;
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
  attachments: ForumMessageAttachmentViewModel[];
}

export interface ForumMessageListViewModel {
  items: ForumMessageViewModel[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
