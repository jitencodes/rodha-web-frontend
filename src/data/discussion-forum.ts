/**
 * Client-facing Discussion Forum shapes (topic + replies) returned by the
 * `/api/discussion-forum/*` route handlers. Built from the Groups App API view
 * models in `src/lib/api/modules/groups/ui.ts`. Topics are questions,
 * messages are replies, and `reactionTypeCount` holds the like/dislike counts.
 */

export type ForumPreviewAuthor = {
  id: string;
  fullName: string;
  profilePicturePath: string | null;
  reputation?: number;
};

export type ForumPreviewQuestion = {
  id: number;
  groupId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  answerCount: number;
  lastActivityAt: string;
  createdAt: string;
  author: ForumPreviewAuthor;
};

export type ForumPreviewAttachment = {
  id: number;
  filePath: string;
  fileName: string;
  mimeType: string;
  isImage: boolean;
};

export type ForumPreviewAnswer = {
  id: number;
  topicId: number;
  content: string;
  createdAt: string;
  editedAt: string | null;
  author: ForumPreviewAuthor;
  reactionTypeCount: { like: number; dislike: number };
  myReaction?: "like" | "dislike" | null;
  attachments: ForumPreviewAttachment[];
  /** Null for top-level posts; parent id for threaded replies. */
  parentMessageId?: number | null;
  replyCount?: number;
};
