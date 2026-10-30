import type {
  ForumPreviewAnswer,
  ForumPreviewQuestion,
  ForumSpaceItem,
  ForumSpaceMember,
  ForumSpaceMessage,
} from "@/data/discussion-forum";

import type {
  DoubtForumViewModel,
  ForumMessageViewModel,
  ForumTopicViewModel,
  GroupMemberViewModel,
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
    myReaction: message.myReaction,
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

/** Map group_chat (or similar) group → Groups / Channels list row. */
export function toForumSpaceItem(group: DoubtForumViewModel): ForumSpaceItem {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    memberCount: group.memberCount,
    messageCount: group.topicCount,
    lastActiveAt: group.lastActivityAt || "",
    iconUrl: group.iconUrl,
    lastMessagePreview: group.lastMessagePreview,
    createdByName: group.createdBy?.fullName ?? null,
    createdByRole: group.createdBy?.role ?? null,
  };
}

export function toForumSpaceItems(
  groups: DoubtForumViewModel[]
): ForumSpaceItem[] {
  return groups.map(toForumSpaceItem);
}

/** Map API message → channel / group chat bubble. */
export function toForumSpaceMessage(
  message: ForumMessageViewModel,
  spaceId: number
): ForumSpaceMessage {
  const content =
    message.content ||
    (message.attachments.length ? "" : "<p></p>");

  return {
    id: message.id,
    spaceId,
    content,
    createdAt: message.createdAt,
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
    status: message.status,
    attachments: message.attachments.map((attachment) => ({
      id: attachment.id,
      filePath: attachment.filePath,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      isImage: attachment.isImage,
    })),
  };
}

export function toForumSpaceMessages(
  messages: ForumMessageViewModel[],
  spaceId: number
): ForumSpaceMessage[] {
  return messages.map((message) => toForumSpaceMessage(message, spaceId));
}

export function toForumSpaceMember(
  member: GroupMemberViewModel
): ForumSpaceMember {
  return {
    id: member.id,
    fullName: member.fullName,
    role: member.role,
    email: member.email ?? undefined,
  };
}

export function toForumSpaceMembers(
  members: GroupMemberViewModel[]
): ForumSpaceMember[] {
  return members.map(toForumSpaceMember);
}
