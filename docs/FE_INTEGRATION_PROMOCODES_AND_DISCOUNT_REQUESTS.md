# FE integration guide — Promocodes & Discount Requests

**For:** website (student) FE, admin panel FE, and their coding agents.
**Backend branch:** `promocode` (merged into `version1.0`).
**Postman (import both, choose _Replace_):**
`postman/Rodha_Promocodes_FE.postman_collection.json` and
`postman/Rodha_Discount_Requests_FE.postman_collection.json`.
Every request there has a field table and **real example responses** (success + common errors).
If this guide and Postman ever disagree, Postman examples are what the API returns.

---

## Pages at a glance

**Admin panel — Promocodes**
1. **Promocodes list** — all codes with filters, active toggle, export. *(new)*
2. **Add / Edit promocode form** — create a code (custom or auto-generated), edit Rodha codes. *(new)*
3. **Conditions dialog** — on a code in the list; works for Graphy codes too. *(new)*
4. **Bulk generate form** — generate N single-use codes. *(new)*
5. **Batches list** — one row per bulk run. *(new)*
6. **Batch detail** — codes of one batch (used / unused) + export. *(new)*

**Admin panel — Discount requests**
7. **Discount requests list (review queue)** — pending first, filters, export. *(new)*
8. **Discount request detail** — all details, proof preview, history, Approve / Reject / Revoke / Extend. *(new)*
9. **Discount masters** — one page with 6 tabs: Discount types · Colleges (with CSV upload) · Academic & EWS slabs · Exams · Exam slabs · Settings. *(new)*

**Student website**
10. **Package detail page** — add the **Request Discount** button / status. *(change)*
11. **Discount request form** — modal or page with the 4 discount-type sections. *(new)*
12. **Resubmit form** — same form, pre-filled, for rejected requests. *(new, reuses 11)*
13. **Student dashboard → My discount requests** — list + detail drawer with proofs. *(new section)*
14. **Cart page** — add the **"Have a code?"** box. *(change)*
15. **Checkout page** — show the Request Discount button / status there too, and handle a code being refused. *(change)*

---

## 0. Read this first (rules that apply to every API below)

| Topic | Rule |
|---|---|
| Base URL | `{API_ORIGIN}/rodha/api/website` (local: `http://localhost:5000/rodha/api/website`) |
| Auth | `Authorization: Bearer <accessToken>` (same token you use today). Admin APIs need an ADMIN / SUBADMIN token, student APIs a STUDENT token. |
| Website category header | **Student APIs listed below need `x-website-category-id: <id>`** (the vertical the student is browsing: MBA = 1, …). Missing → `400 "x-website-category-id header is required"`. Send it on **every** `/student/...` call — it is harmless where not checked. |
| Success envelope | `{ "success": true, "message": "...", "data": <payload>, "timestamp": "..." }` → always read `data`. |
| Error envelope | `{ "success": false, "message": "Human readable", "errors": { "fieldName": ["message"] } \| null }` |
| Status codes | `400` validation (show `errors[field][0]` under that field, else `message` as a toast) · `401` login again · `403` no permission (hide the menu) · `404` not found / not yours · `409` conflict (already exists / already reviewed / limit reached — show `message`) · `429` too many requests (wait and retry) |
| Dates | Send `YYYY-MM-DD`. Dates in responses are `YYYY-MM-DD`; timestamps are IST ISO strings (`…+05:30`). All dates are IST and **inclusive**. |
| Money | Rupees as numbers (`20000`, `1499.5`). Format with `toLocaleString("en-IN")` → `20,000`. |
| Lists | `?page=1&limit=20` → `data.items[]` + `data.pagination { page, limit, total, totalPages }`. Max `limit` = 100 unless stated. |
| Exports | Export APIs return JSON `{ headers: string[], rows: object[], truncated: boolean }`. Build the CSV/Excel on the FE (same as the orders export). If `truncated` is true, tell the admin to narrow the filters. |
| Multipart | Discount request submit/resubmit are `multipart/form-data`. Send every field as a string; booleans as `"true"`. Do **not** set `Content-Type` yourself (the browser adds the boundary). |

**Permissions (sub-admins).** Show/hide menus by these. ADMIN always has everything.

| Permission | Unlocks |
|---|---|
| `read_website_promocodes` / `write_website_promocodes` | Promocodes pages (view / create-edit) |
| `read_website_discount_requests` / `write_website_discount_requests` | Discount Requests queue (view / approve-reject-revoke-extend) |
| `read_website_discount_masters` / `write_website_discount_masters` | Discount Masters pages (view / edit) |

---

# PART A — PROMOCODES

## A1. What changed, in plain words

Before: every promocode came from Graphy. Now admins can also **create Rodha promocodes** in the admin panel.

| Concept | Meaning for the UI |
|---|---|
| `source` | `GRAPHY` (synced, read-only except status/conditions) or `RODHA` (created here, fully editable). |
| `discountType` | `PERCENT` (`discountValue` = %, optional `maxDiscountValue` ₹ cap) or `FLAT` (`discountValue` = ₹). |
| `websiteCategoryId` | The vertical the code belongs to. **A code only works on packages/courses of the same vertical.** Default 1. |
| Product scope | `packageIds` / `courseIds`. **Both empty = all packages & courses of that vertical.** |
| Eligibility | `userIds` (only these students) **or** `conditionPackageIds` (students who already bought one of these packages). Either one is enough. Empty = everyone. |
| `forNewUser` | Only students with no previous purchase. |
| `validFrom` / `validTill` | Optional IST dates, inclusive. |
| `maxUseCount` | Total uses across all students. `0` = unlimited. |
| `autoApply` | `true` = can be auto-applied in the cart. `false` = **listed** to the student but applied only when they click it. |
| Bulk codes | Generated in a batch (`batchId`), always **single-use, never listed, never auto-applied** — the student must **type** them. Used for support-team handouts. |
| Event codes | Just a code with `validFrom`/`validTill`. |

## A2. Admin panel — pages to build

### Promocodes list — `GET /admin/promocodes`
Columns: Code · Source · Vertical · Type & value (e.g. `20% up to ₹3,000` / `₹500`) · Applies to (`All products` when `appliesToAllProducts`, else package/course titles) · Valid (`validFrom – validTill`) · Uses (`usedCount / maxUseCount`, `∞` when 0) · Auto-apply · Active toggle · Actions (Edit, Conditions).

Filters (query params): `search` (code/description), `source` (`GRAPHY`/`RODHA`), `websiteCategoryId`, `isActive`, `autoApply`, `usage` (`used`/`unused`), `packageId`, `includeBulk=true` (bulk codes are hidden by default), `page`, `limit`.
Buttons: **Add promocode**, **Bulk generate**, **Batches**, **Export** (`GET /admin/promocodes/export` with the same filters).

Active toggle → `PATCH /admin/promocodes/:id/status` `{ "isActive": false }`.

### Add / Edit promocode form — `POST /admin/promocodes`, `PUT /admin/promocodes/:id`
Form fields (send only what the admin filled):

| Field | UI | Notes |
|---|---|---|
| `code` | text, upper-case | Optional. Leave empty to auto-generate. 3–40 chars `A–Z 0–9 - _`. Duplicate (any vertical, any source) → `409 errors.code`. |
| `prefix` | text | Only when `code` is empty → `PREFIX-XXXXXXXX`. |
| `websiteCategoryId` | vertical dropdown | Default 1. Packages/courses picked must be in this vertical (else `400 errors.packageIds`). |
| `discountType` | radio PERCENT / FLAT | Required. |
| `discountValue` | number | Required, > 0; PERCENT ≤ 100. |
| `maxDiscountValue` | number | Only for PERCENT (₹ cap). |
| `minCartValue` | number | Optional. |
| `validFrom`, `validTill` | date pickers | Optional; send `null` to clear. |
| `packageIds`, `courseIds` | multi-select | Empty = all products of the vertical. |
| `userIds` | student multi-select | "Special students". |
| `conditionPackageIds` | package multi-select | "Students who already bought…". |
| `forNewUser`, `isActive`, `autoApply` | toggles | `autoApply` default true. |
| `maxUseCount` | number | 0 = unlimited. |
| `description` | textarea | |

Edit (`PUT`): send only changed fields; `null` / `[]` clears. **Graphy codes cannot be edited here** (`400`) — for them show only the Status toggle and the Conditions dialog.

**Conditions dialog** (works for Graphy and Rodha codes) — `PATCH /admin/promocodes/:id/conditions`
`{ "packageIds": [2], "userIds": [], "autoApply": false }` (here `packageIds` means "already bought one of these"). Send at least one field.

### Bulk generate form — `POST /admin/promocodes/bulk`
Fields: `count` (1–5000, required), `prefix`, plus the same settings as create (type, value, cap, dates, vertical, scope, eligibility). No `code`/`maxUseCount`/`autoApply` (fixed: single-use, manual).
Response `data`: `{ batchId, count, prefix, codes: [...] }` → show "200 codes created", offer **Download** (use `codes`) and a link to the batch.

### Batches list + Batch detail — `GET /admin/promocodes/batches`, `GET /admin/promocodes/batches/:batchId`
List columns: Prefix · Created · Total · Used · Unused · Active · Settings summary.
Batch detail: summary + the codes table = `GET /admin/promocodes?batchId=<id>&usage=used|unused&page=…`.
Export a batch: `GET /admin/promocodes/batches/:batchId/export?usage=unused` (e.g. only unused codes to hand out).

## A3. Website — changes

1. **Package detail page & Cart page — promocode list** (already integrated) — `GET /student/packages/:packageId/promocodes` (logged in, **send the category header**) or `GET /packages/:packageId/promocodes` (public).
   `data`: `{ packageId, salePrice, listPrice, isNewUser, suggestedPromocodeId, items: [...] }`. Each item has `code`, `discountType`, `discountValue`, `maxDiscountValue`, `estimatedDiscount`, `estimatedPayable`, `autoApply`, `validTill`…
   Show the list; highlight `suggestedPromocodeId` as "Best offer". Items with `autoApply: false` are shown but **never auto-applied**.
2. **Cart page — NEW "Have a code?" box** — the student can type any code (including bulk/support codes):
   `PATCH /student/cart/items/:cartItemId` body `{ "code": "SUP-ABCD2345" }` (case-insensitive).
   - Picking from the list still works: `{ "promocodeId": 12 }`. Remove: `{ "promocodeId": null }`. Send **one** of `code` / `promocodeId`.
   - Success returns the full cart (`data.items[].discountAmount`, `payableAmount`, `promocode`).
   - Errors to show under the input: `400` → `message` (e.g. "Promocode has expired", "You are not eligible for this promocode", "Promocode is not valid for this package", "Invalid promocode"); `409` → "Promocode usage limit has been reached".
3. **Checkout page** — checkout may refuse a code that was valid in the cart (limit reached meanwhile) → `409` with a message: show it and send the student back to the cart.

---

# PART B — DISCOUNT REQUESTS ("Request Additional Discount")

## B1. How it works

1. Student opens a **Package detail page** (or the Checkout page), clicks **Request Discount**, fills a form for one discount type, uploads proofs → status **PENDING**. (Email sent by backend.)
2. Admin opens the request, sees the proofs and a **suggested %**, then **Approves** (backend gives the student a personal single-use promocode, or the admin assigns an existing one) or **Rejects** with a reason. (Email sent.)
3. The approved code is **auto-applied** in the cart for that package until `validTill` (default 7 days). The student never types it.
4. After payment → **USED**. After `validTill` without payment → **EXPIRED** (student may request again).

Discount types (`discountType`):

| Code | Name | What the student fills |
|---|---|---|
| `COLLEGE` | College based | College (from list), city, state, College ID card, Bonafide / fee receipt |
| `ACADEMIC` | Academic Discount | Class 10 + Class 12: board, state-board name (if needed), school, score format, score, year, marksheet each |
| `EWS` | EWS | Annual family income, certificate issued by, issuing authority (if Other), issue date, certificate |
| `PREV_ATTEMPT` | Previous Attempt Score | Vertical → Exam → Exam year → Score **or** Stage, scorecard |

**Statuses** (field `status`) and what to show:

| status | Student sees | Admin can |
|---|---|---|
| `PENDING` | "Under review — {reviewSlaText}" | Approve / Reject |
| `APPROVED` | "Approved: {promocode.label} — valid till {validTill}" + countdown + **Buy now** | Revoke / Extend |
| `REJECTED` | "Rejected: {rejectReason}" + **Resubmit** | — |
| `USED` | "Used on order #{usedOrderId}" | — |
| `EXPIRED` | "Expired" + **Request again** | Extend (revives it) |
| `REVOKED` | "Cancelled: {revokeReason}" + **Request again** | — |

Rules: only **one active** (PENDING or APPROVED) request per student per package; requests are **packages only**.

## B2. Website (student) — pages & components

> Send `x-website-category-id` on all of these.

### Package detail page + Checkout page: **Request Discount button**
Call `GET /student/discount-requests/current?packageId=<id>` → `data: { canRequest, canResubmit, request }`.

| Response | Render |
|---|---|
| `canRequest: true, request: null` | Button **Request Discount** |
| `canRequest: true, request.status` EXPIRED/REVOKED | Button **Request Discount** (small note "previous request {status}") |
| `canResubmit: true` (REJECTED) | Reason + button **Resubmit** (opens the form pre-filled from `request`) |
| `request.status` PENDING | Badge "Discount request under review" (no button) |
| `request.status` APPROVED | "Your discount {promocode.label} is applied at checkout — valid till {validTill}" |
| `request.status` USED | nothing (or "Discount used") |

Not logged in → button sends the student to login.

### Discount request form (modal or its own page)
Load once: `GET /student/discount-requests/config` → dropdown data:
`discountTypes[]` (only active types; `code`, `name`, `helpText`), `colleges[]` (`id`, `name`, `city`, `state`), `class10Boards[]` / `class12Boards[]` (`id`, `name`, `needsStateBoardName`), `verticals[]` (`id`, `name`), `exams[]` (`id`, `websiteCategoryId`, `name`, `scoreType`, `maxMarks`, `years[]`, `stages[] {id,name}`), `states[]`, `certificateIssuers[]`, `upload { allowedTypes, maxSizeBytes }`, `reviewSlaText`, `validityDays`.

Top of form (read-only): **Course** = package title, **Name / Email / Mobile** = from the logged-in profile. Then **Discount Type** dropdown → show only that section:

**Submit:** `POST /student/discount-requests` (multipart). Always send `packageId`, `discountType`, `declarationAccepted=true`.

| Section | multipart field | UI | Validation (backend enforces, mirror it in the UI) |
|---|---|---|---|
| COLLEGE | `collegeId` | searchable dropdown (`colleges`) | required. No "Other": if not listed show *"Your college is not eligible for this discount."* |
| | `collegeCity` | text (auto-fill from the college's `city`) | required, ≤ 100 |
| | `collegeStateId` | dropdown (`states`), auto-fill from the college | required |
| | `collegeIdCard` | file | required |
| | `bonafideCertificate` | file | required |
| ACADEMIC | `class10BoardId` / `class12BoardId` | dropdowns (`class10Boards` / `class12Boards`) | required |
| | `class10StateBoardName` / `class12StateBoardName` | text, show **only if the chosen board has `needsStateBoardName: true`** | required then, ≤ 100 |
| | `class10School` / `class12School` | text | required, ≤ 150 |
| | `class10ScoreFormat` / `class12ScoreFormat` | radio `PERCENTAGE` / `CGPA` | required |
| | `class10Score` / `class12Score` | number | ≤ 2 decimals; PERCENTAGE 0–100, CGPA 0–10 |
| | `class10YearOfPassing` / `class12YearOfPassing` | year | 1990 – this year; class 12 **later than** class 10 |
| | `class10Marksheet` / `class12Marksheet` | file | required |
| EWS | `annualFamilyIncome` | number, show as `4,50,000` | whole rupees (commas allowed) |
| | `certificateIssuedBy` | radio `CENTRAL` / `STATE` / `OTHER` | required |
| | `certificateIssuingAuthority` | text, **only when OTHER** | required then, ≤ 150 |
| | `certificateIssueDate` | date `YYYY-MM-DD` | not in the future |
| | `ewsCertificate` | file | required |
| PREV_ATTEMPT | (Vertical) | dropdown from `verticals`, **pre-select the current website category**; it only filters exams, it is not sent | |
| | `prevExamId` | dropdown: `exams` where `websiteCategoryId === vertical` | required |
| | `prevExamYear` | dropdown: that exam's `years` | required |
| | (Score type) | read-only text = exam `scoreType` (Percentile / Rank / Marks / Qualified stage) | not sent |
| | `prevScore` | number — when `scoreType` is `PERCENTILE` (0–100, 2 decimals), `RANK` (whole ≥ 1), `MARKS` (0 – `maxMarks`) | required for those |
| | `prevStageId` | dropdown of that exam's `stages` — **instead of** `prevScore` when `scoreType = QUALIFIED_STAGE` | required then |
| | `examScorecard` | file | required |
| Bottom | `declarationAccepted` | checkbox: *"I confirm the details and documents are genuine. Rodha may cancel the discount or course access if they are found false."* | must be `true` |

Files: PDF / JPG / PNG, **max 5 MB each** (check before upload; backend also checks the real file content). Images are compressed by the backend.

Responses: `201` → show *"Request received. We'll review it within 24 hours."* (`message`) and refresh the button. `400` → show `errors[field][0]` under the field (file errors use the file field name, e.g. `errors.examScorecard`). `409` → "You already have an active discount request for this package".

### Resubmit form (from a REJECTED request)
`POST /student/discount-requests/:id/resubmit` — same fields as submit, **same `packageId`**. Pre-fill the form from `GET /student/discount-requests/:id`. **Files are optional**: any proof not re-uploaded is carried over from the rejected request; uploading replaces it. Creates a new request (`previousRequestId` = old id).

### Student dashboard → **My discount requests** (new section)
`GET /student/discount-requests` → `data.items[]` (latest first). Card per request: package title (`item.title`), type (`discountTypeName`), status badge (table in B1), suggested/approved info, dates, buttons (Resubmit / Buy now → package page).
Detail drawer: `GET /student/discount-requests/:id`. Proof preview: `GET /student/discount-requests/:id/files/:fileId` → `data.url` (opens the file; **expires in 5 minutes** — fetch it on click, don't cache).
**Email link:** the Approved / Rejected emails open the **Student dashboard** with `discountRequestId=<id>` in the URL → when present, open that request's drawer.

## B3. Admin panel — pages to build

### Discount requests list (review queue) — `GET /admin/discount-requests`
Default view: `status=PENDING` (sorted **oldest first** automatically).
Columns: Request ID · Date (`createdAt`) · Student name / Email / Mobile (`student`) · Course (`item.title`) · Discount type (`discountTypeName`) · Exam (`prevAttempt.exam.name` + `prevAttempt.year`, only for PREV_ATTEMPT) · Suggested % (`suggestedPercent`) · Final % (`promocode.finalPercent` or `promocode.label`) · Status · Valid till (`validTill`) · Reviewed by (`reviewedBy.name`).
Filters: `status` (PENDING/APPROVED/REJECTED/REVOKED/USED/EXPIRED), `discountType`, `examId`, `packageId`, `websiteCategoryId`, `dateFrom` / `dateTo` (YYYY-MM-DD), `reviewedBy` (admin user id), `search` (name / email / mobile / `#12`), `sortOrder`, `page`, `limit`.
**Export** button → `GET /admin/discount-requests/export` with the same filters.

### Discount request detail — `GET /admin/discount-requests/:id`
Show every field for its type (`college`/`collegeCity`/`collegeState`, `class10`/`class12`, `ews`, `prevAttempt`), the student, the suggested %, and:
- **Proofs**: `files[]` (`label`, `mimeType`) → on click `GET /admin/discount-requests/:id/files/:fileId` → `data.url` (5-min link) → inline preview (image / PDF iframe) + download.
- **History**: `logs[]` (`action`, `actorName`, `createdAt`, `oldValue` → `newValue`, `note`) and `otherRequestsForSamePackage[]`.
- **Actions** (show by status):

| Action | When | API | Body |
|---|---|---|---|
| **Approve** (new code) | PENDING | `POST /admin/discount-requests/:id/approve` | `{ "discountType": "PERCENT", "discountValue": <prefill suggestedPercent>, "maxDiscountValue": 0, "note": "" }` — `discountValue` 0–100 for PERCENT |
| **Approve** (existing code) | PENDING | same | `{ "promocodeId": 123 }` — must be the package's vertical (else 400) |
| **Reject** | PENDING | `POST /admin/discount-requests/:id/reject` | `{ "reason": "..." }` — required. Quick picks: *Document unclear · Not eligible · Details don't match proof · Expired document* |
| **Revoke** | APPROVED (not used) | `POST /admin/discount-requests/:id/revoke` | `{ "reason": "..." }` required |
| **Extend validity** | APPROVED / EXPIRED (not used) | `POST /admin/discount-requests/:id/extend` | `{ "validTill": "YYYY-MM-DD" }` (today or later) |

All return the updated request. `409` = someone else already acted → reload. Emails are sent by the backend.

### Discount masters (one page, 6 tabs)

| Tab | APIs | Notes |
|---|---|---|
| **Discount types** | `GET /admin/discount-masters/types`, `PUT …/types/:id` `{ name, helpText, isActive, sortOrder }` | 4 fixed rows; can't add/delete. Off = hidden on the form. |
| **Colleges** | `GET …/colleges?search=&isActive=&stateId=&page=&limit=` · `POST …/colleges` `{ name, city, stateId, isActive }` · `PUT …/colleges/:id` · `PATCH …/colleges/:id/status` `{ isActive }` · `DELETE …/colleges/:id` · **CSV upload** `POST …/colleges/import` (multipart field `file`, .csv/.xlsx, headers `College name, City, State`, optional `Active`) | Import result: `{ totalRows, created, updated, failed, errors:[{row,message}] }` → show the errors table. Delete of a used college switches it off (`deactivated: true`). |
| **Academic & EWS slabs** | `GET …/slabs?type=ACADEMIC\|EWS` · `POST …/slabs` `{ type, threshold, discountPercent, isActive }` · `PUT …/slabs/:id` · `DELETE …/slabs/:id` | ACADEMIC threshold = min % (0–100; lower of class 10/12 decides). EWS threshold = max annual income ₹. |
| **Exams** (Previous Attempt Score) | `GET …/exams?websiteCategoryId=&isActive=&search=` · `GET …/exams/:id` · `POST …/exams` · `PUT …/exams/:id` · `PATCH …/exams/:id/status` · `DELETE …/exams/:id` | Body: `{ websiteCategoryId (vertical), name, scoreType: PERCENTILE\|RANK\|MARKS\|QUALIFIED_STAGE, betterWhen: HIGHER\|LOWER, maxMarks, years:[2024,2025], stages:["Tier 1","Tier 2"], isActive, sortOrder }`. `years`/`stages` are **full lists** (send the whole list on save). RANK must be LOWER (auto). Show `stages` input only for QUALIFIED_STAGE, `maxMarks` only for MARKS. |
| **Exam slabs** | `GET …/exam-slabs?examId=` · `POST …/exam-slabs` · `PUT …/exam-slabs/:id` · `DELETE …/exam-slabs/:id` | Pick an exam first. Body `{ examId, threshold, discountPercent, isActive }` for PERCENTILE/RANK/MARKS (threshold = min score when HIGHER, max rank when LOWER) or `{ examId, stageId, discountPercent }` for QUALIFIED_STAGE (stage dropdown from the exam). |
| **Settings** | `GET …/settings`, `PUT …/settings` | `{ collegeDiscountPercent, validityDays (1–365), cgpaMultiplier (default 9.5), reviewSlaText, proofRetentionDays }` |

(`…` = `/admin/discount-masters`.) Board list and States come from the **existing** Student Masters / States masters — no new screens.

---

## C. Acceptance checklist (test these before handing over)

**Promocodes (admin):** create a % code with cap → appears in list with "All products"; edit dates; turn off → disappears for students; bulk create 10 → batch shows 10 unused; export unused → 10 rows; Graphy code → only status/conditions editable.
**Promocodes (website):** best code auto-applied in cart; type a bulk code → applied; type it again from another account → 409 message; wrong-vertical code → "not valid for this package".
**Discount (website):** button states for no request / pending / approved / rejected; each of the 4 forms submits with valid data and shows field errors with bad data (try CGPA 11, class 12 year = class 10 year, future EWS date, rank 0, marks above max, missing file, 6 MB file); resubmit without re-uploading files works; dashboard deep link opens the drawer.
**Discount (admin):** queue default = pending oldest first; filters incl. exam; detail shows proofs (link opens); approve → student cart shows the discount automatically; reject requires reason; revoke/extend; masters CRUD incl. exams with stages and exam slabs; college CSV with one bad row shows the error row.

---

## D. Quick API index

**Promocodes — admin** (`/admin/promocodes`): `GET /` · `POST /` · `GET /:id` · `PUT /:id` · `PATCH /:id/status` · `PATCH /:id/conditions` · `POST /bulk` · `GET /export` · `GET /batches` · `GET /batches/:batchId` · `GET /batches/:batchId/export`
**Promocodes — student:** `GET /student/packages/:packageId/promocodes` · `GET /packages/:packageId/promocodes` (public) · `PATCH /student/cart/items/:id` `{ code }` / `{ promocodeId }`
**Discount requests — student** (`/student/discount-requests`): `GET /config` · `GET /current?packageId=` · `POST /` · `GET /` · `GET /:id` · `POST /:id/resubmit` · `GET /:id/files/:fileId`
**Discount requests — admin** (`/admin/discount-requests`): `GET /` · `GET /export` · `GET /:id` · `GET /:id/files/:fileId` · `POST /:id/approve` · `POST /:id/reject` · `POST /:id/revoke` · `POST /:id/extend`
**Discount masters — admin** (`/admin/discount-masters`): `types` · `colleges` (+ `/import`, `/:id/status`) · `slabs` · `exams` (+ `/:id/status`) · `exam-slabs` · `settings`
