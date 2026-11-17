# Discussion Forum — API Gaps & Backend Requirements

**UI direction:** GMAT Club–style forum: compact topic tables grouped by group, Latest/Best Posts rail, threaded topic view. The Circle card grid and the social post-card feed were **dropped**, along with their banner and thumbnail image requirements.
**Sources:** `docs/api-collection/Groups_App_APIs.postman_collection 1.json`, plus live responses from the dev API (`api/app/groups`) checked on 2026-11-17.
**Frontend:** `src/app/(website)/discussion-forum/**`, `src/components/sections/discussion-forum/Forum*.tsx`, `src/lib/api/modules/groups/*`

> Part A covers what the API does **today**. Part B covers proposed changes; 🆕 marks a field or endpoint the backend still needs to add. The UI never shows invented numbers. A column appears only after the API returns its field.

---

## Part A — Existing contract (what the UI uses)

| UI | Endpoint | Notes |
|---|---|---|
| Sidebar groups, home sections, groups page | `GET /api/app/groups?group_type=doubt_forum&page&limit&search&sort_by&sort_order` | `sort_by` accepts `name \| createdAt \| updatedAt \| lastActivityAt` (live validation message) |
| Group page header | `GET /api/app/groups/:seoSlug` | Also returns `members[]` (see A3) |
| Group topic table | `GET /api/app/groups/:groupRef/topics?page&limit&search&sort_by&sort_order` | `sort_by` accepts `lastActivityAt \| createdAt \| title \| messageCount` |
| Topic header + original post | `GET /api/app/groups/:groupRef/topics/:topicSlug` | |
| Replies (threaded) | `GET /api/app/groups/messages?group_id&group_slug&topic_slug&parent_message_id&sort_order=asc` | Top level by default; `parent_message_id` returns direct children |
| Post reply / nested reply | `POST /api/app/groups/messages` (multipart, `parent_message_id`, `files`) | |
| Edit / delete own reply | `PATCH` / `DELETE /api/app/groups/messages/:id` | 4h edit window |
| Like / dislike a reply | `POST` / `DELETE /api/app/groups/messages/:id/reactions` | |
| Create Topic | `POST /api/app/groups/:groupRef/topics` `{ title, content }` | **This endpoint exists**, so the UI uses it |

### A1. Live topic fields (richer than the Postman sample)

```json
{
  "id": 37, "groupId": 25, "title": "…", "slug": "…", "content": "…",
  "messageCount": 15, "replyCount": 13,
  "lastActivityAt": "…", "createdAt": "…", "lastMessageId": 587,
  "author": { "id": "…", "fullName": "System Admin", "userType": "ADMIN", "profilePicturePath": "…", "email": "…", "mobile": null },
  "lastMessage": { "id": 587, "createdAt": "…", "user": { "fullName": "naga rapeti", "…": "…" },
                   "directReplyCount": 0, "attachmentCount": 0, "reactionCount": 0 }
}
```

The topic row columns map to these fields: **Author** ← `author`, **Replies** ← `replyCount`, **Last post** ← `lastMessage.user.fullName` + `lastMessage.createdAt`. Live messages also return `myReaction`, `replyCount` and `reactions[]`.

**Please update the Postman collection** to match: its topic sample is missing `author`, `lastMessage` and `lastMessageId`, and its message sample is missing `myReaction`.

### A2. What the GMAT layout needs vs. what exists

| GMAT element | Status | UI behaviour today |
|---|---|---|
| Topic title, author, created date | ✅ | Shown |
| Reply count | ✅ `replyCount` | Shown |
| Last post (by, when) | ✅ `lastMessage` | Shown, or "No replies yet" |
| **Topic likes / kudos** | ❌ | Column is hidden until `reactionTypeCount` arrives on topics (B2) |
| **Topic views** | ❌ | Column is hidden until `viewCount` arrives (B2) |
| **Latest Posts (forum home)** | ❌ no cross-group endpoint | Rail shows a "pending API" note on home. On group and topic pages it shows real data scoped to the group (`sort_by=lastActivityAt`) |
| **Best Posts (forum home)** | ❌ | Same as above. On group pages: `sort_by=messageCount`, labelled "Most discussed", in the API's own order |
| **Featured groups on home** | ⚠️ | No `isFeatured` flag yet. The UI uses the 3 most recently active groups that have topics (B4) |
| Global topic search in the header | ❌ | Header search covers groups on home/groups pages and the current group's topics on group/topic pages |
| Like / dislike on the original topic post | ❌ | Not shown (reactions exist on messages only) |
| Author stats (posts count, joined date, role badge) | ❌ | Shows the name and avatar only (B5) |

### A3. Bugs / risks found live

1. **🔴 PII leak to guests.** Several responses go to unauthenticated callers with users' **email and mobile** inside:
   - `GET /groups/:ref` → `members[].user`
   - `GET /groups/:ref/topics` → `author`, `lastMessage.user`
   - `GET /groups/messages` → `user`, `reactions[].user`

   The frontend drops these fields, but they are still public over the network. Please return only `{ id, fullName, userType, profilePicturePath }` for app/public responses.
2. **Membership rules contradict each other.** The collection says `doubt_forum` writes need auth only, but Create Topic documents a `403 You must be a group member`, and Send Message says "requires membership". Please confirm whether a logged-in non-member can post or reply in an open forum without calling `POST /join`.
3. **`messageCount` vs `replyCount`.** The live values differ (15 vs 13). Please document what each counts. The UI shows `replyCount` as Replies.
4. **Message ordering.** With no `sort_order`, results arrive in mixed order. The UI always sends `sort_order=asc` for threads. Please define the default.

---

## Part B — Proposed backend changes 🆕

### B1. 🆕 Cross-group topics feed (P0): powers home Latest/Best Posts and global search

`GET /api/app/groups/feed`. Register it **before** `/:groupRef`, or use `/api/app/discussion/feed`.

| Param | Type | Default | Notes |
|---|---|---|---|
| `page`, `limit` | int | 1, 10 | Max 50 |
| `sort_by` | enum | `lastActivityAt` | `lastActivityAt` (Latest Posts) · `messageCount` / `likeCount` / `viewCount` (Best Posts) · `createdAt` |
| `sort_order` | enum | `desc` | |
| `search` | string | — | Title + content. This powers the header search on the forum home |
| `group_id` / `group_slug` | string | — | Optional, comma-separated |
| `since` | ISO date | — | Optional window for "Best this week" |

Response: the existing topic shape, plus the group it belongs to:

```json
{
  "items": [
    {
      "id": 37, "title": "…", "slug": "…", "replyCount": 13, "messageCount": 15,
      "lastActivityAt": "…", "createdAt": "…",
      "author": { "id": "…", "fullName": "…", "userType": "STUDENT", "profilePicturePath": null },
      "lastMessage": { "id": 587, "createdAt": "…", "user": { "id": "…", "fullName": "…" } },
      "group": { "id": 25, "name": "FE Seed Class 10", "seoSlug": "fe-seed-class-10", "groupIcon": null },
      "reactionTypeCount": { "like": 4, "dislike": 0 },
      "viewCount": 120
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 134, "totalPages": 14 }
}
```

`group`, `reactionTypeCount` and `viewCount` are the new keys (🆕). Ranking must happen on the server; the frontend will not re-sort.

### B2. 🆕 Topic engagement fields (P1)

Add these to every topic payload (list, detail, feed):

| Key | Type | Used for |
|---|---|---|
| `reactionTypeCount` | `{ like: number, dislike: number }` | **Likes** column, Best Posts ranking |
| `viewCount` | number | **Views** column. Count unique viewers per day on `GET …/topics/:topicRef` |
| `myReaction` | `"like" \| "dislike" \| null` | Only if topic reactions are added (B3) |

Also add `sort_by=likeCount|viewCount` to `GET …/:groupRef/topics`. The frontend already maps `reactionTypeCount.like` and `viewCount`, so the columns appear on their own once these keys are returned.

### B3. 🆕 Reactions on the original topic post (P2)

`POST|DELETE /api/app/groups/:groupRef/topics/:topicRef/reactions` with body `{ reaction_type: "like" | "dislike" }`, using the same rules as message reactions. Without this, the original post shows no like button.

### B4. 🆕 Featured groups on the forum home (P1)

Add `isFeatured: boolean` and `displayOrder: number` to groups, managed by admins, plus an `is_featured=true` filter on `GET /groups`. The frontend already reads `isFeatured` and falls back to "most recently active" when no group has it set.

### B5. 🆕 Author details for the post view (P2)

Add to `user` / `author` on topics and messages:

| Key | Example | GMAT equivalent |
|---|---|---|
| `userType` | `"MENTOR"` | Role badge (already live on topics; please add it to messages) |
| `postCount` | `128` | "Posts: 128" |
| `joinedAt` | ISO date | "Joined: Mar 2025" |

### B6. Threading (P2)

- Optional `include_replies=1&reply_limit=3` on `GET /groups/messages` would return each top-level item with `replies[]`. Today the page makes one request per post with replies (N+1).
- When a parent message is soft deleted but still has active replies, return it as a stub `{ id, status: "Deleted", content: null }`. Today those replies would show up as top-level posts.

### B7. Not needed for this design

Group banners and topic cover images/thumbnails were Circle and post-card requirements. The GMAT layout uses `groupIcon` only, so no image upload work is required. Create Topic stays `{ title, content }`.

---

## Summary for the backend developer

| Priority | Item |
|---|---|
| **P0** | Strip email/mobile from public user objects (A3.1) · `GET /feed` with `sort_by` + `search` (B1) · confirm the membership rules (A3.2) |
| **P1** | `reactionTypeCount` + `viewCount` on topics, plus `sort_by=likeCount\|viewCount` (B2) · `isFeatured` / `displayOrder` on groups (B4) · update the Postman samples (A1) · define `messageCount`/`replyCount` and the default message order |
| **P2** | Topic reactions (B3) · author `postCount` / `joinedAt` / `userType` on messages (B5) · `include_replies` and deleted-parent stubs (B6) |
