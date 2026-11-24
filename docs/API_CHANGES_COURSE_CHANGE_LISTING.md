# Course Change: API changes needed for search, filters and pagination

**For:** backend · **Raised:** 23 Nov 2026 · **Base:** `/api/website/student/course-changes`

The student dialog and the history page are paginated, searchable lists. Today `GET /eligibility` returns every option of every package, and `GET /requests` returns the whole history. Please add the optional query params below.

Every change is **additive**: calls without the new params keep today's response. The website already sends these params, and until they ship it filters and pages the current response itself. No frontend release is needed when they go live.

| # | Endpoint | Change | Priority |
|---|---|---|---|
| 1 | `GET /eligibility` | Paginated `options` for one course | Required |
| 2 | `GET /requests` | Filter, search, pagination | Required |
| 3 | Course objects | Add `language` | Required for the language filter |
| 4 | `GET /eligibility` | Accept unknown params without a 400 | Until 1 ships |

---

## 1. `GET /eligibility`: options of one course

```
GET /eligibility?packageId=130&fromCourseId=85&search=R2&language=Hinglish&sortBy=title&sortOrder=asc&page=1&limit=6
```

| Param | Type | Rules |
|---|---|---|
| `fromCourseId` | int | **Turns on the listing.** Website course id the student holds. |
| `packageId` | int | Optional. When omitted with `fromCourseId`, use the first active package that contains the course and has options. |
| `search` | string ≤ 100 | Case-insensitive match on the option title. |
| `language` | string | Exact match on the option language. |
| `sortBy` | `title` | Optional. When omitted, keep the admin's option order. |
| `sortOrder` | `asc` \| `desc` | Default `asc`. |
| `page` | int ≥ 1 | Default 1. |
| `limit` | int 1–24 | Default 6. |

Response: today's fields, plus `options`. `packages` may be omitted when `fromCourseId` is sent.

```json
{
  "success": true,
  "message": "Course change eligibility fetched",
  "data": {
    "enabled": true,
    "canRequest": true,
    "blockedReason": null,
    "blockedMessage": null,
    "nextAllowedAt": null,
    "used": 0,
    "max": 1,
    "remaining": 1,
    "cooldownDays": 30,
    "pendingRequestId": null,
    "options": {
      "package": { "id": 130, "title": "CAT 2027 | R1 (Hinglish) | Complete Batch" },
      "course": { "id": 85, "title": "CAT 2027 VARC - R1 (Live Classes)" },
      "items": [
        {
          "id": 112,
          "title": "CAT 2027 VARC - R2 (Live Classes)",
          "slug": "cat-2027-varc-r2-live-classes-",
          "graphyProductId": "6af10c2e9b1d4a0012ab34cd",
          "bannerImageUrl": null,
          "isActive": false,
          "language": "Hinglish"
        }
      ],
      "pagination": { "page": 1, "limit": 6, "total": 14, "totalPages": 3 },
      "filters": {
        "packages": [
          { "id": 130, "title": "CAT 2027 | R1 (Hinglish) | Complete Batch" }
        ],
        "languages": ["English", "Hinglish"]
      }
    }
  }
}
```

Rules the website relies on:

- **`options.package` is `null` only when the course has no options in any owned package.** The website then hides the "Request course change" button. A search with no matches must still return `options.package`, with `items: []` and `total: 0`.
- **`filters` ignores `search`, `language` and `page`**, so the dropdowns stay complete. `filters.packages` lists every owned package where this course can be changed; `filters.languages` covers the selected package.
- `items` must exclude courses the student already has, as today.
- When `canRequest` is `false`, return `options` as usual (or `null`). The website shows `blockedMessage` instead of the list.

Errors: `400` when `fromCourseId` or `packageId` is invalid, `404` when the student is not enrolled in the package.

## 2. `GET /requests`: history

```
GET /requests?status=PENDING&search=VARC&page=1&limit=10
```

| Param | Type | Rules |
|---|---|---|
| `status` | `PENDING` \| `APPROVED` \| `REJECTED` \| `CANCELLED` | Optional. `PENDING` must include `FAILED`, which students see as pending. |
| `search` | string ≤ 100 | Matches from-course, to-course and package titles. |
| `page` | int ≥ 1 | Default 1. |
| `limit` | int 1–50 | Default 10. |

Response: `data.items` as today (newest first), plus:

```json
"pagination": { "page": 1, "limit": 10, "total": 13, "totalPages": 2 }
```

Please send `pagination` **only when the filters were applied on the server**. The website treats its presence as "already filtered" and stops filtering itself.

## 3. Course objects: `language`

Add `language` (string or `null`) to `course` and `options[]` in `/eligibility`. The website reuses the Continue Watching card, whose tag and filter use it. Until then the card shows "Course" and the language filter stays hidden.

## 4. Unknown params

If the validator rejects unknown query params, the website retries without them after a `400`. That costs one extra call per load, so please let them through until change 1 ships.

---

## Website usage

| Where | Call |
|---|---|
| `/account/courses/:id`, "Request course change" dialog | `GET /eligibility?fromCourseId=…` through `GET /api/account/course-changes/options` |
| Confirm dialog | `POST /requests` (unchanged) |
| `/account/course-changes`, "Course Switch Requests" | `GET /requests?status=&search=&page=&limit=`, `POST /requests/:id/cancel` (unchanged) |

All calls send `x-website-category-id` (default `1`).
