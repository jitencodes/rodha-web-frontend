import { io, type Socket } from "socket.io-client";

import { getRealtimeServerUrl } from "@/lib/api/env";
import { AUTH_LOGGED_IN_COOKIE_NAME } from "@/lib/auth/session-cookie";
import { expireSessionClient } from "@/lib/auth/session-expired";

import type {
  GroupRoomHandlers,
  OpenGroupChat,
  PersonalRealtimeHandlers,
  RealtimeAck,
} from "./types";

let socket: Socket | null = null;
let currentToken: string | null = null;
let connectPromise: Promise<void> | null = null;
let unauthorizedHandled = false;
let openChat: OpenGroupChat | null = null;
let roomHandlers: GroupRoomHandlers | null = null;
let personalHandlers: PersonalRealtimeHandlers | null = null;

function emitJoin(groupId: number) {
  socket?.emit("group:join", { groupId }, (res?: RealtimeAck) => {
    if (res && res.ok === false && res.message) {
      console.warn(res.message);
    }
  });
}

function detachRoom(target: Socket, handlers: GroupRoomHandlers) {
  target.off("message:new", handlers.onNew);
  target.off("message:edited", handlers.onEdited);
  target.off("message:deleted", handlers.onDeleted);
  target.off("reaction:updated", handlers.onReaction);
  target.off("group:archived", handlers.onArchived);
  target.off("group:deleted", handlers.onDeletedGroup);
  target.off("typing", handlers.onTyping);
}

function attachRoom(target: Socket, handlers: GroupRoomHandlers) {
  target.on("message:new", handlers.onNew);
  target.on("message:edited", handlers.onEdited);
  target.on("message:deleted", handlers.onDeleted);
  target.on("group:archived", handlers.onArchived);
  target.on("group:deleted", handlers.onDeletedGroup);
  target.on("reaction:updated", handlers.onReaction);
  target.on("typing", handlers.onTyping);
}

function bindLifecycle(target: Socket) {
  target.on("connect", () => {
    unauthorizedHandled = false;
    if (!openChat) return;
    emitJoin(openChat.groupId);
    openChat.refetch();
  });

  target.on("connect_error", (err: Error) => {
    if (err.message !== "unauthorized" || unauthorizedHandled) return;
    unauthorizedHandled = true;
    disconnectRealtime();
    const path = `${window.location.pathname}${window.location.search}`;
    void expireSessionClient(path);
  });

  target.on("group:user_added", () => {
    personalHandlers?.onUserAdded();
  });

  target.on("group:user_removed", (payload: { groupId?: number }) => {
    const groupId = payload?.groupId;
    if (typeof groupId !== "number" || !Number.isFinite(groupId)) return;
    personalHandlers?.onUserRemoved(groupId);
  });
}

function ensureSocket(token: string): Socket | null {
  const url = getRealtimeServerUrl();
  if (!url || typeof window === "undefined") return null;

  if (!socket) {
    socket = io(url, {
      auth: { token },
      transports: ["websocket"],
      autoConnect: false,
    });
    bindLifecycle(socket);
    if (roomHandlers) attachRoom(socket, roomHandlers);
  }

  return socket;
}

function hasLoggedInCookie(): boolean {
  return document.cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${AUTH_LOGGED_IN_COOKIE_NAME}=1`));
}

async function fetchSocketToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/realtime/token", { cache: "no-store" });
    if (!res.ok) return null;
    const body = (await res.json()) as { token?: string };
    const token = body.token?.trim();
    return token || null;
  } catch {
    return null;
  }
}

/** Connect once for the logged-in user. No-ops for guests and when already live. */
export async function connectRealtime(): Promise<void> {
  if (typeof window === "undefined") return;
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    if (!hasLoggedInCookie()) {
      disconnectRealtime();
      return;
    }

    const token = await fetchSocketToken();
    if (!token) {
      disconnectRealtime();
      return;
    }

    const client = ensureSocket(token);
    if (!client) return;

    if (currentToken && currentToken !== token) {
      currentToken = token;
      client.auth = { token };
      client.disconnect().connect();
      return;
    }

    currentToken = token;
    client.auth = { token };
    if (!client.connected) client.connect();
  })().finally(() => {
    connectPromise = null;
  });

  return connectPromise;
}

/** Drop the shared connection. Call on logout. */
export function disconnectRealtime(): void {
  currentToken = null;
  socket?.disconnect();
}

export function setPersonalHandlers(
  handlers: PersonalRealtimeHandlers | null
): void {
  personalHandlers = handlers;
}

export function closeOpenGroupChat(groupId: number): void {
  if (openChat?.groupId !== groupId) return;
  openChat.close();
}

/**
 * Join the open group_chat room and listen for room events.
 * Re-joins on reconnect. Cleanup leaves the room and removes listeners.
 */
export function bindGroupChat(
  groupId: number,
  handlers: GroupRoomHandlers,
  session: { refetch: () => void; close: () => void }
): () => void {
  const chat: OpenGroupChat = {
    groupId,
    refetch: session.refetch,
    close: session.close,
  };
  openChat = chat;

  if (socket && roomHandlers) detachRoom(socket, roomHandlers);
  roomHandlers = handlers;
  if (socket) attachRoom(socket, handlers);
  if (socket?.connected) emitJoin(groupId);

  return () => {
    emitGroupTyping(groupId, false);
    if (openChat === chat) {
      if (socket?.connected) {
        socket.emit("group:leave", { groupId });
      }
      openChat = null;
    }
    if (roomHandlers === handlers) {
      if (socket) detachRoom(socket, handlers);
      roomHandlers = null;
    }
  };
}

/** Typing is not echoed to the sender. Emit false on idle, send, and leave. */
export function emitGroupTyping(groupId: number, isTyping: boolean): void {
  if (!socket?.connected || !Number.isFinite(groupId)) return;
  socket.emit("typing", { groupId, isTyping });
}
