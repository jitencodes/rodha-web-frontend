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
  GetForumMessagesParams,
  GetForumTopicsParams,
  PostForumMessageParams,
  ReactToForumMessageParams,
  UpdateForumMessageParams,
} from "./types";

const PATH = "api/app/groups";
/** The website only exposes discussion forums (not group chats / channels). */
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
    search: params.search?.trim(),
    sort_by: params.sortBy,
    sort_order: params.sortOrder,
  });

  const data = await apiGetOrNull<DoubtForumListApi>(`${PATH}${query}`);
  return mapDoubtForumList(data);
}

export async function getDoubtForumBySlug(
  slug: string
): Promise<DoubtForumViewModel | null> {
  const normalized = decodeURIComponent(slug).trim().toLowerCase();
  if (!normalized) return null;

  // `GET api/app/groups/:groupRef` accepts the seoSlug directly.
  const detail = await apiGetOrNull<DoubtForumApi>(
    `${PATH}/${encodeURIComponent(normalized)}`
  );
  const mappedDetail = detail ? mapGroupDetail(detail) : null;
  if (mappedDetail && (!mappedDetail.type || mappedDetail.type === GROUP_TYPE)) {
    // Drop `members` — the forum UI never shows them (and they carry PII).
    const { members: _members, ...forum } = mappedDetail;
    void _members;
    return forum;
  }

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
    search: params.search?.trim(),
    sort_by: params.sortBy,
    sort_order: params.sortOrder,
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
    parent_message_id:
      typeof params.parentMessageId === "number" && params.parentMessageId > 0
        ? params.parentMessageId
        : undefined,
    sort_order: params.sortOrder,
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

/**
 * Topic thread for the detail page: top-level posts (oldest first) plus the
 * direct replies of every post that has `replyCount > 0`. Deeper levels are
 * loaded on demand via `parent_message_id`. Returned flat; the UI nests by
 * `parentMessageId`.
 */
export async function getGroupTopicThread(
  params: Omit<GetForumMessagesParams, "parentMessageId" | "sortOrder">
): Promise<ForumMessageListViewModel | null> {
  const topLevel = await getGroupTopicMessages({ ...params, sortOrder: "asc" });
  if (!topLevel) return null;

  const withReplies = topLevel.items.filter((item) => item.replyCount > 0);
  const replyLists = await Promise.all(
    withReplies.map((item) =>
      getGroupTopicMessages({
        ...params,
        page: 1,
        limit: 50,
        parentMessageId: item.id,
        sortOrder: "asc",
      })
    )
  );

  return {
    ...topLevel,
    items: [
      ...topLevel.items,
      ...replyLists.flatMap((list) => list?.items ?? []),
    ],
  };
}

/**
 * Post a forum reply. Requires Bearer token. Multipart form-data:
 * `group_id` + `topic_slug` (+ optional `parent_message_id` / `files`).
 */
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
  if (!Number.isFinite(groupId) || groupId <= 0) {
    throw new Error("Invalid group");
  }
  if (!topicSlug) {
    throw new Error("Invalid topic");
  }
  if (!content && !(params.files?.length)) {
    throw new Error("Write a message before posting.");
  }

  const form = new FormData();
  form.append("group_id", String(groupId));
  form.append("content", content || "");
  form.append("topic_slug", topicSlug);
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
