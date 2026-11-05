# Website UI API requirements

The public site UI is ahead of a few backend contracts. Current search only indexes `PACKAGE`, `FACULTY`, and `RESOURCE`. The promotional popup and recent-purchase feed have no endpoint yet.

## Global search

`GET api/website/search`

Keep the existing envelope and hit shape. Extend it as follows.

### Query

| Param | Values |
|-------|--------|
| `q` | Free text |
| `entityTypes` | CSV. Registered set must include `PACKAGE`, `FACULTY`, `RESOURCE`, `BLOG`, `FAQ`, `SUCCESS_STORY`, `TESTIMONIAL`, `STUDENT_RESULT`, `CATEGORY` |
| `scope` | `website` (default) or `account` |
| `page`, `limit` | Existing pagination |

`scope=account` returns only student surfaces: enrolled packages, orders, course content, and test series. It must ignore marketing-only types (success stories, testimonials, public results, blogs, FAQs, categories). Optional Bearer token still sets `isSelfEnrolled` on packages.

### Each hit `data`

Every item needs:

- `title` (or the type's existing title field: `fullName`, `question`, `name`)
- `imageUrl` (nullable). Existing image fields may stay (`bannerImageUrl`, `profileImageUrl`, `thumbnailUrl`)
- `path` — site-relative path such as `/courses/ca-final-combo`, `/faculty/rahul-sharma`, `/blog/my-post`, `/category/cat`, `/success-stories`, `/testimonials`, `/results`, `/faq`, `/account/orders`

Resources that leave the site keep `redirectUrl`.

Until `BLOG`, `FAQ`, `SUCCESS_STORY`, `TESTIMONIAL`, `STUDENT_RESULT`, and `CATEGORY` are registered, the website shows an empty state for those filters instead of treating a 400 as a crash.

## Promotional banner (promo dialog)

`GET api/website/promotional-banner`

Return `data: null` when nothing is scheduled or outside the date window. Otherwise:

```json
{
  "id": 2,
  "title": "CAT 2027 Booster course live",
  "mediaType": "IMAGE",
  "mediaUrl": "https://cdn.example/banner.png",
  "videoYoutubeLink": null,
  "startDate": "2026-10-27T00:00:00.000+05:30",
  "endDate": "2026-10-31T00:00:00.000+05:30",
  "link": "https://www.youtube.com/watch?v=example"
}
```

`mediaType` is `IMAGE` or `VIDEO`. IMAGE media is clickable to `link`. VIDEO uses `videoYoutubeLink` (thumbnail → autoplay after 1.5s; click opens YouTube in a new tab).

The site opens this once per browser after `NEXT_PUBLIC_PROMO_DIALOG_DELAY_MS`, then hides it for 24 hours.

## Recent purchase toast

`GET api/website/recent-purchases`

Return the latest public purchase, or `data: null`:

```json
{
  "studentName": "Aisha",
  "itemName": "CAT Accelerator",
  "purchasedAt": "2026-10-15T10:00:00.000+05:30"
}
```

The toast auto-closes after `NEXT_PUBLIC_PURCHASE_TOAST_MS` (default 10 seconds). A manual close hides it for 24 hours in that browser.

## Contact form

`POST api/website/contact` should accept optional `examYear` (string, for example `"2026"`) in addition to `fullName`, `countryCode`, `phone`, `email`, `websiteCategoryId`, and `message`. The promotional dialog sends exam year as its own field.
