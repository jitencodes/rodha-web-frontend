import type {
  ForumPreviewAnswer,
  ForumPreviewQuestion,
} from "@/data/discussion-forum";

import type { ForumMessageViewModel, ForumTopicViewModel } from "./types";

/** Map API topic → topic UI model (route handler responses + thread page). */
export function toForumPreviewQuestion(
  topic: ForumTopicViewModel
): ForumPreviewQuestion {
  return {
    id: topic.id,
    groupId: topic.groupId,
    title: topic.title,
    slug: topic.slug,
    content: topic.content || topic.excerpt,
    excerpt: topic.excerpt,
    answerCount: topic.replyCount,
    lastActivityAt: topic.lastActivityAt || topic.createdAt || "",
    createdAt: topic.createdAt || "",
    author: {
      id: topic.author.id,
      fullName: topic.author.fullName,
      profilePicturePath: topic.author.profilePicturePath,
    },
  };
}

/** Map API message → reply UI model. */
export function toForumPreviewAnswer(
  message: ForumMessageViewModel,
  topicId: number
): ForumPreviewAnswer {
  const content =
    message.content ||
    (message.attachments.length ? "" : "<p>Attachment</p>");

  return {
    id: message.id,
    topicId,
    content,
    createdAt: message.createdAt,
    editedAt: message.editedAt,
    author: {
      id: message.author.id,
      fullName: message.author.fullName,
      profilePicturePath: message.author.profilePicturePath,
    },
    reactionTypeCount: {
      like: message.likeCount,
      dislike: message.dislikeCount,
    },
    myReaction: message.myReaction,
    attachments: message.attachments.map((attachment) => ({
      id: attachment.id,
      filePath: attachment.filePath,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      isImage: attachment.isImage,
    })),
    parentMessageId: message.parentMessageId,
    replyCount: message.replyCount,
  };
}

export function toForumPreviewAnswers(
  messages: ForumMessageViewModel[],
  topicId: number
): ForumPreviewAnswer[] {
  return messages.map((message) => toForumPreviewAnswer(message, topicId));
}
