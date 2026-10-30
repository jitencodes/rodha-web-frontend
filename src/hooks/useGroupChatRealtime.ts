"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { mapForumMessage } from "@/lib/api/modules/groups/mapper";
import type { ForumMessageApi } from "@/lib/api/modules/groups/types";
import { toForumSpaceMessage } from "@/lib/api/modules/groups/ui";
import type { ForumSpaceMessage } from "@/data/discussion-forum";
import {
  bindGroupChat,
  emitGroupTyping,
} from "@/lib/realtime/socket";
import type { ReactionUpdatedEvent, TypingEvent } from "@/lib/realtime/types";

const TYPING_IDLE_MS = 2500;
const TYPING_HIDE_MS = 5000;

type Typer = {
  name: string;
  timeoutId: number;
};

type UseGroupChatRealtimeOptions = {
  groupId: number;
  enabled: boolean;
  onNew: (message: ForumSpaceMessage) => void;
  onEdited: (message: ForumSpaceMessage) => void;
  onDeleted: (messageId: number) => void;
  onReaction: (message: ForumSpaceMessage) => void;
  onArchived: (isArchived: boolean) => void;
  onGroupGone: () => void;
  refetch: () => void;
};

function toChatMessage(
  raw: ForumMessageApi,
  groupId: number
): ForumSpaceMessage | null {
  if (typeof raw.groupId === "number" && raw.groupId !== groupId) return null;
  const mapped = mapForumMessage(raw);
  if (!mapped) return null;
  return toForumSpaceMessage(mapped, groupId);
}

function isMessage(value: unknown): value is ForumMessageApi {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as ForumMessageApi).id === "number"
  );
}

function typingLabelFrom(names: string[]): string | null {
  if (names.length === 0) return null;
  if (names.length === 1) return `${names[0]} is typing…`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing…`;
  return "Several people are typing…";
}

/**
 * Group-chat room only. Channels and forums must pass `enabled: false`.
 * Listeners are removed on cleanup so they do not stack.
 */
export function useGroupChatRealtime({
  groupId,
  enabled,
  onNew,
  onEdited,
  onDeleted,
  onReaction,
  onArchived,
  onGroupGone,
  refetch,
}: UseGroupChatRealtimeOptions): {
  typingLabel: string | null;
  notifyTyping: () => void;
  stopTyping: () => void;
} {
  const [typingLabel, setTypingLabel] = useState<string | null>(null);
  const typersRef = useRef<Map<string, Typer>>(new Map());
  const typingIdleRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);

  const onNewRef = useRef(onNew);
  const onEditedRef = useRef(onEdited);
  const onDeletedRef = useRef(onDeleted);
  const onReactionRef = useRef(onReaction);
  const onArchivedRef = useRef(onArchived);
  const onGroupGoneRef = useRef(onGroupGone);
  const refetchRef = useRef(refetch);
  onNewRef.current = onNew;
  onEditedRef.current = onEdited;
  onDeletedRef.current = onDeleted;
  onReactionRef.current = onReaction;
  onArchivedRef.current = onArchived;
  onGroupGoneRef.current = onGroupGone;
  refetchRef.current = refetch;

  const publishTyping = useCallback(() => {
    const names = [...typersRef.current.values()].map((typer) => typer.name);
    setTypingLabel(typingLabelFrom(names));
  }, []);

  const stopTyping = useCallback(() => {
    if (typingIdleRef.current !== null) {
      window.clearTimeout(typingIdleRef.current);
      typingIdleRef.current = null;
    }
    if (!isTypingRef.current) return;
    isTypingRef.current = false;
    emitGroupTyping(groupId, false);
  }, [groupId]);

  const notifyTyping = useCallback(() => {
    if (!enabled) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      emitGroupTyping(groupId, true);
    }
    if (typingIdleRef.current !== null) {
      window.clearTimeout(typingIdleRef.current);
    }
    typingIdleRef.current = window.setTimeout(() => {
      isTypingRef.current = false;
      typingIdleRef.current = null;
      emitGroupTyping(groupId, false);
    }, TYPING_IDLE_MS);
  }, [enabled, groupId]);

  useEffect(() => {
    if (!enabled || !Number.isFinite(groupId) || groupId <= 0) return;

    const typers = typersRef.current;

    const clearTyper = (userId: string) => {
      const existing = typers.get(userId);
      if (!existing) return;
      window.clearTimeout(existing.timeoutId);
      typers.delete(userId);
    };

    const onTyping = (payload: TypingEvent) => {
      if (!payload || payload.groupId !== groupId) return;
      const userId = String(payload.userId ?? "");
      if (!userId) return;
      clearTyper(userId);
      if (!payload.isTyping) {
        publishTyping();
        return;
      }
      const timeoutId = window.setTimeout(() => {
        typers.delete(userId);
        publishTyping();
      }, TYPING_HIDE_MS);
      typers.set(userId, {
        name: payload.user?.fullName?.trim() || "Someone",
        timeoutId,
      });
      publishTyping();
    };

    const unbind = bindGroupChat(
      groupId,
      {
        onNew: (raw) => {
          if (!isMessage(raw)) return;
          const message = toChatMessage(raw, groupId);
          if (!message) return;
          onNewRef.current(message);
        },
        onEdited: (raw) => {
          if (!isMessage(raw)) return;
          const message = toChatMessage(raw, groupId);
          if (!message) return;
          onEditedRef.current(message);
        },
        onDeleted: (raw) => {
          if (!isMessage(raw)) return;
          if (typeof raw.groupId === "number" && raw.groupId !== groupId) return;
          onDeletedRef.current(raw.id);
        },
        onReaction: (payload: ReactionUpdatedEvent) => {
          const raw = payload?.message;
          if (!isMessage(raw)) return;
          const message = toChatMessage(raw, groupId);
          if (!message) return;
          onReactionRef.current(message);
        },
        onArchived: (payload) => {
          if (!payload || payload.groupId !== groupId) return;
          onArchivedRef.current(Boolean(payload.isArchived));
        },
        onDeletedGroup: (payload) => {
          if (!payload || payload.groupId !== groupId) return;
          onGroupGoneRef.current();
        },
        onTyping,
      },
      {
        refetch: () => refetchRef.current(),
        close: () => onGroupGoneRef.current(),
      }
    );

    return () => {
      if (typingIdleRef.current !== null) {
        window.clearTimeout(typingIdleRef.current);
        typingIdleRef.current = null;
      }
      if (isTypingRef.current) {
        isTypingRef.current = false;
        emitGroupTyping(groupId, false);
      }
      for (const typer of typers.values()) window.clearTimeout(typer.timeoutId);
      typers.clear();
      setTypingLabel(null);
      unbind();
    };
  }, [enabled, groupId, publishTyping]);

  return {
    typingLabel: enabled ? typingLabel : null,
    notifyTyping,
    stopTyping,
  };
}
