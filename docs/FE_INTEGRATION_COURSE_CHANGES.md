# Course Change — FE Integration Guide

A student swaps **one course for another inside a package they own**. The admin reviews and approves or rejects. It is free (no payment, no promocode).

Postman: `postman/Rodha_Course_Changes_FE.postman_collection.json` (examples for every response below).

---

## How it works

1. Admin sets **settings**: on/off, waiting days between requests, max requests per student.
2. Admin opens **Course → Edit** and picks the courses a student can switch to from that course.
3. Student opens **Change course**, picks a course from one of their packages and a target course, adds an optional reason, submits.
4. Admin **approves** or **rejects** (reject needs a remark).
5. On approve the student gets the new course on Graphy, loses the old one, and the new course starts fresh (no progress carried over).
6. Every request is kept as history — student sees their own, admin sees it on the student detail page.

### Rules (enforced by the backend)

| Rule | Detail |
|---|---|
| One open request | A student can have only one request under review at a time. |
| Max requests | Every request counts — approved, rejected and cancelled too. |
| Waiting days | Counted from the student's **last request** (any status). |
| Eligible only | Target must be in the admin's list for that course, and not a course the student already has. |
| Inside a package | The course being changed must be part of a package the student is actively enrolled in. |

---

## Statuses

| Status | Admin sees | Student sees | Meaning |
|---|---|---|---|
| `PENDING` | Pending | Under review | Waiting for admin |
| `APPROVED` | Approved | Approved | Course changed |
| `REJECTED` | Rejected | Rejected + `adminRemark` | Not changed |
| `CANCELLED` | Cancelled | Cancelled | Student cancelled it |
| `FAILED` | **Failed + `graphyError`** | Under review (shown as `PENDING`) | Graphy call failed during approve. Admin clicks Approve again to retry. |

---

## Student — "Change course" screen

All student APIs need header **`x-website-category-id`**. Base: `/api/website/student/course-changes`.

### 1. Load the screen — `GET /eligibility?packageId=`

`packageId` optional (omit = all the student's active packages in the category).

```json
{
  "enabled": true,
  "canRequest": true,
  "blockedReason": null,
  "blockedMessage": null,
  "nextAllowedAt": null,
  "used": 0, "max": 1, "remaining": 1,
  "cooldownDays": 30,
  "pendingRequestId": null,
  "packages": [
    {
      "package": { "id": 130, "title": "CAT 2027 | R1 ..." },
      "courses": [
        { "course": { "id": 85, "title": "VARC R1", ... }, "options": [ { "id": 112, "title": "VARC R2", ... } ] }
      ]
    }
  ]
}
```

UI:
- `canRequest = false` → disable the form and show `blockedMessage`.
  - `COOLDOWN` → also show "You can request again on `nextAllowedAt`".
  - `PENDING_EXISTS` → show the pending request (from the history list, id = `pendingRequestId`) with a **Cancel** button.
  - `MAX_REACHED`, `DISABLED` → message only.
- Show "`remaining` of `max` changes left".
- Dropdown 1 = `packages[].courses[].course` (only courses that can be changed are listed). Dropdown 2 = that course's `options`.
- `packages` empty and `canRequest` true → "No courses in your packages can be changed."

### 2. Submit — `POST /requests`

```json
{ "packageId": 130, "fromCourseId": 85, "toCourseId": 112, "reason": "optional, max 1000" }
```

- `201` → show success, reload eligibility + history.
- `409` with `errors.blockedReason` → show the message (state changed since the screen loaded).
- `400` with field errors (`fromCourseId`, `toCourseId`) → show under the field.

### 3. History — `GET /requests`

Newest first. Show: from course → to course, package, status, date, and `adminRemark` when rejected.

### 4. Cancel — `POST /requests/:id/cancel`

Only for `PENDING`. Tell the student a cancelled request still counts toward their limit.

---

## Admin

Base: `/api/website/admin/course-changes`.

Permissions: `read_website_course_changes` / `write_website_course_changes` for requests and settings. Course options and import use the existing `read_website_courses` / `write_website_courses`. Admin role bypasses checks.

### Settings page — `GET /settings`, `PUT /settings`

| Field | Type | Rules |
|---|---|---|
| `isEnabled` | boolean | Off → students see `DISABLED`. |
| `cooldownDays` | number | 0–3650. 0 = no wait. |
| `maxRequests` | number | 0–100. 0 = nobody can request. |

`PUT` is partial — send only the changed fields.

### Course → Edit: "Course change options" section

- Load: `GET /courses/:courseId/options` → `{ courseId, items: [course] }`.
- Save: `PUT /courses/:courseId/options` with `{ "toCourseIds": [112, 140] }` — replaces the whole list, order kept. `[]` clears it.
- Course picker: use the existing admin course list API filtered to the **same website category**. The backend rejects other categories and the course itself.

**Import hidden course** (button near the picker): `POST /courses/import`

```json
{ "websiteCategoryId": 1, "graphyProductId": "6af10c2e9b1d4a0012ab34cd" }
```

Use it when a target course is hidden on Graphy and not in the course list yet. It comes in **inactive** (not shown on the public website). `404` = that product id is a package or does not exist.

> Admin note: target courses must be **hidden but available for sale** on Graphy. If a course is "not for sale", Graphy refuses to give it and the approve fails.

### Requests page — `GET /requests`

Query (all optional): `status`, `search` (student name/email/mobile, course titles), `websiteCategoryId`, `packageId`, `courseId` (matches from or to), `userId`, `page`, `limit` (≤100), `sortOrder` (`asc`|`desc` by created date).

Columns: student (name, email, mobile), package, from course → to course, reason, status, requested on, reviewed by/on.

Detail: `GET /requests/:id` — also has `graphyError`, `graphyAssignedAt`, `graphyUnassignedAt`.

Actions (only when status is `PENDING` or `FAILED`):
- **Approve** — `POST /requests/:id/approve` `{ "remark": "optional" }`
  - `200` → done.
  - `502` → Graphy failed; the request is now `FAILED`. Show `message`, keep the **Approve** button (label it "Retry") — retry only repeats the step that is left.
- **Reject** — `POST /requests/:id/reject` `{ "remark": "required" }`
  - `409` if the new course was already given on Graphy → tell the admin to Approve again to finish instead.

### Student detail page — "Course change history"

`GET /requests?userId=<studentId>&limit=50` — same list, same columns. Read-only.

---

## Error format

```json
{ "success": false, "message": "Validation failed", "errors": { "toCourseId": ["You cannot switch to this course"] }, "statusCode": 400 }
```

| Code | When |
|---|---|
| 400 | Validation (field errors in `errors`) |
| 404 | Request / course / package not found, or student not enrolled in the package |
| 409 | Blocked (`errors.blockedReason`), or already reviewed / being processed |
| 502 | Graphy failed during approve (request is `FAILED`) |
