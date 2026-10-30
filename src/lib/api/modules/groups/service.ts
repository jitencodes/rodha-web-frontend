import {
  apiDelete,
  apiGetOrNull,
  apiPatch,
  apiPost,
  apiPostFormData,
} from "@/lib/api/client";
import { buildApiQuery } from "@/lib/api/query";

import {
  mapDoubtForumList,
  mapForumMessage,
  mapForumMessageList,
  mapForumMessageReactionResult,
  mapGroupDetail,
  mapGroupMembership,
  mapForumTopic,
  mapForumTopicList,
} from "./mapper";
import type {
  DoubtForumApi,
  DoubtForumListApi,
  DoubtForumListViewModel,
  DoubtForumViewModel,
  ForumMessageApi,
  ForumMessageListApi,
  ForumMessageListViewModel,
  ForumMessageReactionResultApi,
  ForumMessageReactionResultViewModel,
  ForumMessageViewModel,
  ForumTopicApi,
  ForumTopicListApi,
  ForumTopicListViewModel,
  ForumTopicViewModel,
  CreateForumTopicParams,
  GetDoubtForumsParams,
  GetAppGroupsParams,
  GetForumMessagesParams,
  GetGroupDetailParams,
  GetGroupMessagesParams,
  GetForumTopicsParams,
  GroupDetailViewModel,
  GroupMembershipApi,
  GroupMembershipViewModel,
  PostForumMessageParams,
  ReactToForumMessageParams,
  UpdateForumMessageParams,
} from "./types";

const PATH = "api/app/groups";
const GROUP_TYPE = "doubt_forum";
const GROUP_CHAT_TYPE = "group_chat";
const BROADCAST_CHANNEL_TYPE = "broadcast_channel";
const LOOKUP_PAGE_SIZE = 20;
const LOOKUP_MAX_PAGES = 10;

async function getAppGroupsByType(
  groupType: string,
  params: GetAppGroupsParams = {}
): Promise<DoubtForumListViewModel | null> {
  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? LOOKUP_PAGE_SIZE,
    group_type: groupType,
  });

  const data = await apiGetOrNull<DoubtForumListApi>(`${PATH}${query}`, {
    accessToken: params.accessToken,
    cache: "no-store",
  });

  return mapDoubtForumList(data);
}

async function getAppGroupById(
  groupType: string,
  id: number,
  accessToken?: string
): Promise<DoubtForumViewModel | null> {
  if (!Number.isFinite(id) || id <= 0) return null;

  for (let page = 1; page <= LOOKUP_MAX_PAGES; page += 1) {
    const list = await getAppGroupsByType(groupType, {
      page,
      limit: LOOKUP_PAGE_SIZE,
      accessToken,
    });
    if (!list) return null;

    const match = list.items.find((item) => item.id === id);
    if (match) return match;
    if (page >= list.totalPages) break;
  }

  return null;
}

export async function getDoubtForums(
  params: GetDoubtForumsParams = {}
): Promise<DoubtForumListViewModel | null> {
  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? LOOKUP_PAGE_SIZE,
    group_type: GROUP_TYPE,
  });

  const data = await apiGetOrNull<DoubtForumListApi>(`${PATH}${query}`);
  return mapDoubtForumList(data);
}

export async function getDoubtForumBySlug(
  slug: string
): Promise<DoubtForumViewModel | null> {
  const normalized = decodeURIComponent(slug).trim().toLowerCase();
  if (!normalized) return null;

  for (let page = 1; page <= LOOKUP_MAX_PAGES; page += 1) {
    const list = await getDoubtForums({ page, limit: LOOKUP_PAGE_SIZE });
    if (!list) return null;

    const match = list.items.find(
      (item) =>
        item.slug.toLowerCase() === normalized || String(item.id) === normalized
    );
    if (match) return match;
    if (page >= list.totalPages) break;
  }

  return null;
}

/** Logged-in study / mentor group chats (`group_type=group_chat`). */
export async function getGroupChats(
  params: GetAppGroupsParams = {}
): Promise<DoubtForumListViewModel | null> {
  return getAppGroupsByType(GROUP_CHAT_TYPE, params);
}

/** Group/channel detail including `members` — `GET api/app/groups/:id`. */
export async function getAppGroupDetail(
  params: GetGroupDetailParams
): Promise<GroupDetailViewModel | null> {
  const groupId = params.groupId;
  if (!Number.isFinite(groupId) || groupId <= 0) return null;

  const data = await apiGetOrNull<DoubtForumApi>(`${PATH}/${groupId}`, {
    accessToken: params.accessToken,
    cache: "no-store",
  });

  const mapped = mapGroupDetail(data);
  if (!mapped) return null;

  if (
    params.expectedType &&
    mapped.type &&
    mapped.type !== params.expectedType
  ) {
    return null;
  }

  return mapped;
}

export async function getGroupChatById(
  id: number,
  accessToken?: string
): Promise<GroupDetailViewModel | null> {
  const detail = await getAppGroupDetail({
    groupId: id,
    accessToken,
    expectedType: GROUP_CHAT_TYPE,
  });
  if (detail) return detail;
  // Fallback: list lookup when detail is unavailable.
  const fromList = await getAppGroupById(GROUP_CHAT_TYPE, id, accessToken);
  return fromList ? { ...fromList, members: [] } : null;
}

/**
 * Membership gate — `GET api/app/groups/:groupId/membership`.
 * Pass a positive `groupId` and Bearer token.
 */
export async function getGroupMembership(
  groupId: number,
  accessToken: string
): Promise<GroupMembershipViewModel | null> {
  if (!Number.isFinite(groupId) || groupId <= 0) return null;
  if (!accessToken.trim()) return null;

  const data = await apiGetOrNull<GroupMembershipApi>(
    `${PATH}/${groupId}/membership`,
    { accessToken, cache: "no-store" }
  );

  return mapGroupMembership(data);
}

/** Logged-in broadcast channels (`group_type=broadcast_channel`). */
export async function getBroadcastChannels(
  params: GetAppGroupsParams = {}
): Promise<DoubtForumListViewModel | null> {
  return getAppGroupsByType(BROADCAST_CHANNEL_TYPE, params);
}

export async function getBroadcastChannelById(
  id: number,
  accessToken?: string
): Promise<GroupDetailViewModel | null> {
  const detail = await getAppGroupDetail({
    groupId: id,
    accessToken,
    expectedType: BROADCAST_CHANNEL_TYPE,
  });
  if (detail) return detail;
  const fromList = await getAppGroupById(
    BROADCAST_CHANNEL_TYPE,
    id,
    accessToken
  );
  return fromList ? { ...fromList, members: [] } : null;
}

export async function getGroupTopics(
  groupId: number,
  params: GetForumTopicsParams = {}
): Promise<ForumTopicListViewModel | null> {
  if (!Number.isFinite(groupId) || groupId <= 0) return null;

  const query = buildApiQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 20,
  });

  const data = await apiGetOrNull<ForumTopicListApi>(
    `${PATH}/${groupId}/topics${query}`
  );

  return mapForumTopicList(data, groupId);
}

/** Create a question/topic. Requires Bearer token. JSON `{ title, content }`. */
export async function createGroupTopic(
  accessToken: string,
  params: CreateForumTopicParams
): Promise<ForumTopicViewModel> {
  const groupId = params.groupId;
  const title = params.title.trim();
  const content = params.content.trim();

  if (!accessToken.trim()) {
    throw new Error("Not authenticated");
  }
  if (!Number.isFinite(groupId) || groupId <= 0) {
    throw new Error("Invalid group");
  }
  if (!title) {
    throw new Error("Title is required.");
  }
  if (!content) {
    throw new Error("Write some details before posting.");
  }

  const data = await apiPost<ForumTopicApi, { title: string; content: string }>(
    `${PATH}/${groupId}/topics`,
    { title, content },
    { accessToken }
  );

  const mapped = mapForumTopic(data, groupId);
  if (!mapped) {
    throw new Error("Topic created but could not be mapped");
  }
  return mapped;
}

/** Question body only. Answers stay on `getGroupTopicMessages`. */
export async function getGroupTopic(
  groupSlug: string,
  topicSlug: string,
  fallbackGroupId?: number
): Promise<ForumTopicViewModel | null> {
  const group = decodeURIComponent(groupSlug).trim();
  const topic = decodeURIComponent(topicSlug).trim();
  if (!group || !topic) return null;

  const data = await apiGetOrNull<ForumTopicApi>(
    `${PATH}/${encodeURIComponent(group)}/topics/${encodeURIComponent(topic)}`,
    { cache: "no-store" }
  );

  if (!data) return null;
  return mapForumTopic(data, fallbackGroupId);
}

/** Answers list for a question. Uses group_id + group_slug + topic_slug. */
export async function getGroupTopicMessages(
  params: GetForumMessagesParams
): Promise<ForumMessageListViewModel | null> {
  const groupId = params.groupId;
  const groupSlug = decodeURIComponent(params.groupSlug).trim();
  const topicSlug = decodeURIComponent(params.topicSlug).trim();

  if (!Number.isFinite(groupId) || groupId <= 0 || !groupSlug || !topicSlug) {
    return null;
  }

  const query = buildApiQuery({
    group_id: groupId,
    group_slug: groupSlug,
    topic_slug: topicSlug,
    page: params.page ?? 1,
    limit: params.limit ?? 50,
  });

  // Answers change often — never serve a cached list after post/edit.
  const data = await apiGetOrNull<ForumMessageListApi>(
    `${PATH}/messages${query}`,
    {
      cache: "no-store",
      accessToken: params.accessToken,
    }
  );

  return mapForumMessageList(data);
}

/** Channel / group-chat messages by `group_id` only. */
export async function getGroupMessages(
  params: GetGroupMessagesParams
): Promise<ForumMessageListViewModel | null> {
  const groupId = params.groupId;
  if (!Number.isFinite(groupId) || groupId <= 0) return null;

  const query = buildApiQuery({
    group_id: groupId,
    page: params.page ?? 1,
    limit: params.limit ?? 50,
  });

  const data = await apiGetOrNull<ForumMessageListApi>(
    `${PATH}/messages${query}`,
    {
      cache: "no-store",
      accessToken: params.accessToken,
    }
  );

  return mapForumMessageList(data);
}

/**
 * Create a message. Requires Bearer token. Multipart form-data.
 * - doubt_forum: `group_id` + `topic_slug` (+ optional `parent_message_id`)
 * - group_chat: `group_id` + `content` / `files` only
 */
export async function postGroupMessage(
  accessToken: string,
  params: PostForumMessageParams
): Promise<ForumMessageViewModel> {
  const groupId = params.groupId;
  const topicSlug = params.topicSlug
    ? decodeURIComponent(params.topicSlug).trim()
    : "";
  const content = params.content.trim();

  if (!accessToken.trim()) {
    throw new Error("Not authenticated");
  }
  if (!Number.isFinite(groupId) || groupId <= 0) {
    throw new Error("Invalid group");
  }
  if (!content && !(params.files?.length)) {
    throw new Error("Write a message before posting.");
  }

  const form = new FormData();
  form.append("group_id", String(groupId));
  form.append("content", content || "");

  if (topicSlug) {
    form.append("topic_slug", topicSlug);
    if (
      typeof params.parentMessageId === "number" &&
      Number.isFinite(params.parentMessageId) &&
      params.parentMessageId > 0
    ) {
      form.append("parent_message_id", String(params.parentMessageId));
    }
  }

  for (const file of params.files ?? []) {
    form.append("files", file, file.name);
  }

  const data = await apiPostFormData<ForumMessageApi>(
    `${PATH}/messages`,
    form,
    { accessToken }
  );

  const mapped = mapForumMessage(data);
  if (!mapped) {
    throw new Error("Message created but could not be mapped");
  }
  return mapped;
}

/** Edit an answer/message by id. Requires Bearer token. JSON `{ content }`. */
export async function updateGroupMessage(
  accessToken: string,
  params: UpdateForumMessageParams
): Promise<ForumMessageViewModel> {
  const messageId = params.messageId;
  const content = params.content.trim();

  if (!accessToken.trim()) {
    throw new Error("Not authenticated");
  }
  if (!Number.isFinite(messageId) || messageId <= 0) {
    throw new Error("Invalid message id");
  }
  if (!content) {
    throw new Error("Write an answer before saving.");
  }

  const data = await apiPatch<ForumMessageApi, { content: string }>(
    `${PATH}/messages/${messageId}`,
    { content },
    { accessToken }
  );

  const mapped = mapForumMessage(data);
  if (!mapped) {
    throw new Error("Message updated but could not be mapped");
  }
  return mapped;
}

/** Delete an answer/message by id. Requires Bearer token. */
export async function deleteGroupMessage(
  accessToken: string,
  messageId: number
): Promise<void> {
  if (!accessToken.trim()) {
    throw new Error("Not authenticated");
  }
  if (!Number.isFinite(messageId) || messageId <= 0) {
    throw new Error("Invalid message id");
  }

  await apiDelete<unknown>(`${PATH}/messages/${messageId}`, { accessToken });
}

/** Set a reaction on a message/answer. Requires Bearer. Body `{ reaction_type }`. */
export async function reactToGroupMessage(
  accessToken: string,
  params: ReactToForumMessageParams
): Promise<ForumMessageReactionResultViewModel> {
  const messageId = params.messageId;
  const reactionType = params.reactionType;

  if (!accessToken.trim()) {
    throw new Error("Not authenticated");
  }
  if (!Number.isFinite(messageId) || messageId <= 0) {
    throw new Error("Invalid message id");
  }
  if (reactionType !== "like" && reactionType !== "dislike") {
    throw new Error("Invalid reaction type");
  }

  const data = await apiPost<
    ForumMessageReactionResultApi,
    { reaction_type: string }
  >(
    `${PATH}/messages/${messageId}/reactions`,
    { reaction_type: reactionType },
    { accessToken }
  );

  const mapped = mapForumMessageReactionResult(data);
  if (!mapped) {
    throw new Error("Reaction updated but could not be mapped");
  }
  return mapped;
}

/**
 * Remove the current user's reaction.
 * `DELETE api/app/groups/messages/:messageId/reactions`
 */
export async function removeGroupMessageReaction(
  accessToken: string,
  messageId: number
): Promise<ForumMessageReactionResultViewModel> {
  if (!accessToken.trim()) {
    throw new Error("Not authenticated");
  }
  if (!Number.isFinite(messageId) || messageId <= 0) {
    throw new Error("Invalid message id");
  }

  const data = await apiDelete<
    ForumMessageReactionResultApi | ForumMessageApi | null
  >(`${PATH}/messages/${messageId}/reactions`, { accessToken });

  if (data == null) {
    return { action: "removed", message: null };
  }

  const asResult = mapForumMessageReactionResult(
    data as ForumMessageReactionResultApi
  );
  if (asResult) return asResult;

  const message = mapForumMessage(data as ForumMessageApi);
  if (message) {
    return { action: "removed", message };
  }

  return { action: "removed", message: null };
}
