# Archive Courses — FE Integration Guide

A student moves a course out of their **enrolled course list** into an **Archived** tab, and can bring it back anytime. Student only; there is no admin screen.

Postman: `postman/Rodha_Archive_Courses_FE.postman_collection.json` (examples for every response below).

---

## How it works

1. Student clicks **Archive** on a course in My Courses.
2. The course leaves the main list and shows in the **Archived** tab.
3. Student clicks **Restore** there and it goes back to the main list.

### Rules (enforced by the backend)

| Rule | Detail |
|---|---|
| Own list only | Archiving affects only that student. |
| Any enrolled course | Also a course inside a package. Archiving a package is not available. |
| Nothing is lost | Access, progress, validity, orders and refunds stay the same. The course still opens. |
| Today's content | Today's classes and tests of archived courses still show. |
| Continue watching | Archived courses are hidden from the dashboard's `continueWatching`. `courseStats` still counts them. |
| Lost access | If the student loses the course and gets it again, it comes back **not** archived. |
| Rodha only | Not synced with Graphy. Archiving here does not archive it on Graphy, or the reverse. |

---

## Student — My Courses

All calls need header **`x-website-category-id`** and the student token. Base: `/api/website/student`.

### 1. Tabs — `GET /courses`

| Tab | Call |
|---|---|
| My Courses | `GET /courses` (or `?archived=false`) |
| Archived | `GET /courses?archived=true` |

- `search`, `packageIds`, `categoryId`, `subCategory1`, `validTillFrom`, `validTillTo`, `sortBy`, `page` and `limit` work on both tabs.
- Each item has `archivedAt`: `null` = not archived, otherwise the date it was archived.
- Use `pagination.total` for the tab count. The two tabs never share a course.
- `todayContents` is the same on both tabs. Show it on the main tab only.
- Empty Archived tab → "No archived courses."

**Existing screens:** `GET /courses` without `archived` now leaves archived courses out. Any screen that needs every enrolled course must call both.

### 2. Archive or restore — `PATCH /courses/:id/archive`

`:id` = **course id** (`items[].course.id`), not `enrollmentId`.

```json
{ "archived": true }
```

`true` archives, `false` restores. Must be a JSON boolean, not a string.

```json
{ "enrollmentId": 5012, "courseId": 112, "archivedAt": "2026-11-23T15:10:00.000+05:30" }
```

- Success → remove the card from the current tab and show `message` ("Course archived successfully" / "Course restored successfully"). An **Undo** button can send the opposite value.
- If it was the last card on the page, load the previous page.
- Sending the same value again is safe; the first archive date is kept.

### 3. Course page — `GET /courses/:id`

`enrollment.archivedAt` is included. Show **Restore** when it is set, **Archive** when it is `null`.

### 4. Filter dropdowns — `GET /courses/filter-options`

Unchanged: they still include archived courses, so a filter can return an empty list on one tab.

---

## Errors

| Code | When | UI |
|---|---|---|
| 400 | `archived` missing or not a boolean (body), or not `true`/`false` (query); bad course id; missing or wrong `x-website-category-id` | Show `message` |
| 401 | Not logged in | Login |
| 404 | Not enrolled, access removed, or course is in another website category | Show `message`, reload the list |

Error body: `{ "success": false, "message": "...", "errors": { "field": ["..."] } }` (`errors` can be `null`).
