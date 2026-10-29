import type {
  ForumPreviewAnswer,
  ForumPreviewQuestion,
} from "@/data/discussion-forum";

import type {
  ForumMessageViewModel,
  ForumTopicViewModel,
} from "./types";

/** Map API topic → existing question card / detail UI model. */
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
    tags: [],
    voteScore: 0,
    answerCount: topic.replyCount,
    viewCount: 0,
    hasAcceptedAnswer: false,
    lastActivityAt: topic.lastActivityAt || topic.createdAt || "",
    createdAt: topic.createdAt || "",
    author: {
      id: topic.author.id,
      fullName: topic.author.fullName,
      profilePicturePath: topic.author.profilePicturePath,
    },
  };
}

export function toForumPreviewQuestions(
  topics: ForumTopicViewModel[]
): ForumPreviewQuestion[] {
  return topics.map(toForumPreviewQuestion);
}

/** Map API message → existing answer UI model. */
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
    voteScore: message.likeCount - message.dislikeCount,
    isAccepted: false,
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
    attachments: message.attachments.map((attachment) => ({
      id: attachment.id,
      filePath: attachment.filePath,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      isImage: attachment.isImage,
    })),
  };
}

export function toForumPreviewAnswers(
  messages: ForumMessageViewModel[],
  topicId: number
): ForumPreviewAnswer[] {
  return messages.map((message) => toForumPreviewAnswer(message, topicId));
}
