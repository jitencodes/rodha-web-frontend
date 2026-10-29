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
  mapForumTopic,
  mapForumTopicList,
} from "./mapper";
import type {
  DoubtForumListApi,
  DoubtForumListViewModel,
  DoubtForumViewModel,
  ForumMessageApi,
  ForumMessageListApi,
  ForumMessageListViewModel,
  ForumMessageViewModel,
  ForumTopicApi,
  ForumTopicListApi,
  ForumTopicListViewModel,
  ForumTopicViewModel,
  CreateForumTopicParams,
  GetDoubtForumsParams,
  GetForumMessagesParams,
  GetForumTopicsParams,
  PostForumMessageParams,
  UpdateForumMessageParams,
} from "./types";

const PATH = "api/app/groups";
const GROUP_TYPE = "doubt_forum";
const LOOKUP_PAGE_SIZE = 20;
const LOOKUP_MAX_PAGES = 10;

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
    { cache: "no-store" }
  );

  return mapForumMessageList(data);
}

/** Create an answer/message. Requires Bearer token. Multipart form-data. */
export async function postGroupMessage(
  accessToken: string,
  params: PostForumMessageParams
): Promise<ForumMessageViewModel> {
  const groupId = params.groupId;
  const topicSlug = decodeURIComponent(params.topicSlug).trim();
  const content = params.content.trim();

  if (!accessToken.trim()) {
    throw new Error("Not authenticated");
  }
  if (!Number.isFinite(groupId) || groupId <= 0 || !topicSlug) {
    throw new Error("Invalid group or topic");
  }
  if (!content && !(params.files?.length)) {
    throw new Error("Write an answer before posting.");
  }

  const form = new FormData();
  form.append("group_id", String(groupId));
  form.append("topic_slug", topicSlug);
  form.append("content", content || "");

  if (
    typeof params.parentMessageId === "number" &&
    Number.isFinite(params.parentMessageId) &&
    params.parentMessageId > 0
  ) {
    form.append("parent_message_id", String(params.parentMessageId));
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
