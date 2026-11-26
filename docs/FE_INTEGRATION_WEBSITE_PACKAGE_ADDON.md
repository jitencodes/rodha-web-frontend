# Website Package as an Add-on — API Changes

New add-on type `WEBSITE_PACKAGE`: a website package sold as an add-on of another package. No new APIs.

Admin base `/api/website/admin`. Public base `/api/website`. Student base `/api/website/student`. Examples show `data` only.

---

## 1. Create / edit add-on — `POST /addons`, `PUT /addons/:id`

`type` accepts `WEBSITE_PACKAGE`. Send `websitePackageId` only (not `courseId`, `buddyPackageId`, `bookId`).

Request

```json
{ "name": "CAT Mocks Package", "type": "WEBSITE_PACKAGE", "price": 2999, "websitePackageId": 12 }
```

Response (`201` create, `200` edit)

```json
{
  "id": 9,
  "name": "CAT Mocks Package",
  "type": "WEBSITE_PACKAGE",
  "price": 2999,
  "isActive": true,
  "courseId": null,
  "buddyPackageId": null,
  "bookId": null,
  "websitePackageId": 12,
  "course": null,
  "buddyPackage": null,
  "book": null,
  "websitePackage": {
    "id": 12,
    "slug": "cat-mocks",
    "graphyTitle": "CAT Mocks 2026",
    "packageTitle": "CAT Mocks",
    "isActive": true,
    "price": 4999,
    "discountedPrice": 2999
  }
}
```

| Code | Message |
|---|---|
| 400 | `websitePackageId is required for WEBSITE_PACKAGE` |
| 400 | `WEBSITE_PACKAGE must only set websitePackageId` |
| 400 | `A package cannot be an add-on of itself` (edit only) |
| 404 | `Website package not found` |
| 409 | `An add-on already exists for this master` (one add-on per package) |

## 2. List / get add-on — `GET /addons`, `GET /addons/:id`, `PATCH /addons/:id/status`

- New filter value: `GET /addons?type=WEBSITE_PACKAGE`
- Every add-on now has `websitePackageId` and `websitePackage` (both `null` for other types). Same shape as above.

## 3. Package edit — `PUT /packages/:id`

`addonIds` cannot include an add-on that gives this same package.

```json
{
  "success": false,
  "message": "Add-on \"CAT Mocks Package\" gives this same package, so it cannot be its add-on",
  "errors": { "addonIds": ["Add-on \"CAT Mocks Package\" gives this same package, so it cannot be its add-on"] },
  "statusCode": 400
}
```

## 4. Add-ons on package and cart APIs

`GET /packages/:id` (admin), `GET /packages`, `GET /packages/:slug`, `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:id`, `GET /packages/upgrades/quote`

Add-on items now have `websitePackageId` and `websitePackage`.
`owned: true` for a `WEBSITE_PACKAGE` add-on = the student already has that package active.

```json
{
  "id": 9,
  "name": "CAT Mocks Package",
  "type": "WEBSITE_PACKAGE",
  "price": 2999,
  "websitePackageId": 12,
  "websitePackage": { "id": 12, "slug": "cat-mocks", "graphyTitle": "CAT Mocks 2026", "packageTitle": "CAT Mocks", "isActive": true, "price": 4999, "discountedPrice": 2999 },
  "sortOrder": 1,
  "owned": false
}
```

Cart request is unchanged: `POST /cart/items` `{ "packageId": 130, "addonIds": [9] }`

| Code | Message |
|---|---|
| 409 | `Add-on "CAT Mocks Package" is already in your account` |

## 5. Orders — `GET /orders`, `GET /orders/:id` (student and admin)

`items[].addons[]` has `websitePackageId`.

```json
{ "id": 77, "addonId": 9, "name": "CAT Mocks Package", "type": "WEBSITE_PACKAGE", "price": 2999, "courseId": null, "buddyPackageId": null, "bookId": null, "websitePackageId": 12 }
```

`boughtAddons[].type` can also be `WEBSITE_PACKAGE`.

## 6. Enrollments — `GET /student/packages`, admin `GET /enrollments`

After payment, the add-on package shows as its **own package enrollment** with `"order": null` (it was paid on the parent package's order).

```json
{ "id": 300, "type": "package", "status": "ACTIVE", "package": { "id": 12, "slug": "cat-mocks", "title": "CAT Mocks" }, "order": null }
```

## 7. Unassign / refund — `POST /enrollments/:id/unassign`, `POST /enrollments/:id/refund`

- Unassign or refund of the **parent** package also removes the add-on package (unless the student bought that package separately).
- Refund directly on the add-on package enrollment is not allowed (no order):

| Code | Message |
|---|---|
| 400 | `Only Rodha package purchases can be refunded (no linked order)` |
| 502 | `Could not remove add-on "CAT Mocks Package" on Graphy: <reason>` (retry is safe) |
