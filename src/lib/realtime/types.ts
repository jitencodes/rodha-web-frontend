import type { ForumMessageApi } from "@/lib/api/modules/groups/types";

export type RealtimeAck = {
  ok: boolean;
  message?: string;
};

export type RealtimeUser = {
  id?: string;
  fullName?: string | null;
};

export type TypingEvent = {
  groupId: number;
  isTyping: boolean;
  userId: string;
  user?: RealtimeUser | null;
};

export type GroupArchivedEvent = {
  groupId: number;
  isArchived: boolean;
};

export type GroupDeletedEvent = {
  groupId: number;
};

export type GroupMembershipEvent = {
  groupId: number;
  userId?: string;
};

export type ReactionUpdatedEvent = {
  action?: string;
  reaction?: unknown;
  message?: ForumMessageApi | null;
};

export type GroupRoomHandlers = {
  onNew: (message: ForumMessageApi) => void;
  onEdited: (message: ForumMessageApi) => void;
  onDeleted: (message: ForumMessageApi) => void;
  onReaction: (payload: ReactionUpdatedEvent) => void;
  onArchived: (payload: GroupArchivedEvent) => void;
  onDeletedGroup: (payload: GroupDeletedEvent) => void;
  onTyping: (payload: TypingEvent) => void;
};

export type OpenGroupChat = {
  groupId: number;
  refetch: () => void;
  close: () => void;
};

export type PersonalRealtimeHandlers = {
  onUserAdded: () => void;
  onUserRemoved: (groupId: number) => void;
};
