# Package Upgrade Pending + Invoice PDF — FE Guide

Covers: abandoned Razorpay upgrade recovery, `pendingUpgrade` on enrollments, order `kind`, async invoice PDF, admin package list `upgradeTargets`, and active-only package dropdown.

Postman: `postman/Rodha_Package_Upgrade_Pending_Invoice_FE.postman_collection.json` (example response on every request).

---

## Student flow (upgrade)

```
1. See options          GET  /enrollments  or  /packages
                        → availableUpgrades[]  OR  pendingUpgrade
2a. No pending          GET  /packages/upgrades/quote
                        POST /packages/upgrades/checkout  → open Razorpay
                        POST /packages/upgrades/payments/verify
2b. Window / Razorpay closed by mistake
                        UI shows pendingUpgrade (options list is empty)
                        Complete → POST .../payments/resume → Razorpay → verify
                        Cancel   → POST .../upgrades/cancel  → reload options
3. Orders / invoices    GET  /orders  (kind: PURCHASE | UPGRADE)
                        invoice.pdfUrl may be null briefly → poll until set
```

Base: `/rodha/api/website/student`  
Auth: student JWT.  
Upgrade quote / checkout / resume / cancel / verify: **do not** require `x-website-category-id`.  
Enrollments / packages lists: **require** `x-website-category-id`.

---

## APIs

| API | New? | Purpose |
|---|---|---|
| `GET /enrollments` | Field | `pendingUpgrade` + `availableUpgrades` |
| `GET /packages` | Field | same as enrollments (flat package shape) |
| `POST /packages/upgrades/payments/resume` | **New** | Re-open Razorpay for pending upgrade |
| `POST /packages/upgrades/cancel` | **New** | Cancel pending upgrade so options return |
| `GET /orders`, `GET /orders/:id` | Field | `kind`: `PURCHASE` \| `UPGRADE` |
| `POST /orders/:id/retry-fulfill` | Behavior | Also re-queues missing invoice PDF |
| `POST /packages/upgrades/checkout` | Behavior | Same; verify response may have `pdfUrl: null` |
| `POST /packages/upgrades/payments/verify` | Behavior | Invoice row sync; PDF via queue |
| `POST /payments/verify` | Behavior | Same PDF queue for purchase |

Admin:

| API | New? | Purpose |
|---|---|---|
| `GET /admin/packages` | Field | `upgradeTargets[]` on each list item |
| `GET /admin/packages/dropdown` | Behavior | **Active packages only** |

---

## 1. See options — `pendingUpgrade`

When the student started checkout and closed Razorpay / lost network:

- `availableUpgrades` is `[]`
- `pendingUpgrade` is set — **do not** show an empty state with no actions

```json
"pendingUpgrade": {
  "upgradeId": 3,
  "orderId": 47,
  "orderNumber": "ORD-MWX5UJE1-16D5AC",
  "status": "PENDING",
  "sourceEnrollmentId": 46596,
  "sourcePackageId": 129,
  "targetPackageId": 130,
  "targetPackage": {
    "id": 130,
    "slug": "…",
    "title": "CAT 2027 | R1 Comprehensive…",
    "bannerImageUrl": null
  },
  "payableAmount": 14799.8,
  "currency": "INR",
  "razorpayOrderId": "order_…",
  "canResume": true,
  "canCancel": true
}
```

UI:

- Banner: “Payment incomplete for {targetPackage.title}”
- **Complete payment** → resume (if `canResume`)
- **Cancel** → cancel, then reload enrollments

When `pendingUpgrade` is `null`, show `availableUpgrades` as before.

---

## 2. Resume payment

`POST /packages/upgrades/payments/resume`

```json
{ "orderId": 47 }
```

Response includes `keyId`, `razorpayOrderId`, `amountPaise`, `prefill` — open Razorpay Checkout, then call verify with the Razorpay payload.

| Code | Meaning |
|---|---|
| 200 | Resume payload ready |
| 404 | Not your pending upgrade order |
| 409 | Payment session missing — cancel and start checkout again |
| 503 | Razorpay not configured |

---

## 3. Cancel pending

`POST /packages/upgrades/cancel`

```json
{ "orderId": 47 }
```

Marks order `CANCELLED`, upgrade `FAILED`. Reload enrollments → `availableUpgrades` returns.

| Code | Meaning |
|---|---|
| 200 | Cancelled |
| 404 | Pending upgrade order not found |

---

## 4. Orders list — `kind`

Upgrades create the same `website_orders` / invoice rows as purchases and appear in `GET /orders`.

```json
{
  "id": 47,
  "orderNumber": "ORD-…",
  "status": "PENDING",
  "kind": "UPGRADE",
  "payableAmount": 14799.8,
  "invoices": []
}
```

Paid purchase example:

```json
{
  "id": 46,
  "status": "PAID",
  "kind": "PURCHASE",
  "invoices": [
    {
      "id": 21,
      "invoiceNumber": "INV-46-MWX5PERK8A37",
      "pdfUrl": null
    }
  ]
}
```

---

## 5. Invoice PDF (async)

After purchase or upgrade verify:

1. Invoice **row** is created immediately (`invoiceNumber` present).
2. **PDF** is generated on the `invoice-pdf` BullMQ queue (Puppeteer + S3).
3. `pdfUrl` may be `null` for a few seconds (or longer if Chromium/S3 fails and retries).

FE:

- Hide download when `pdfUrl` is null.
- Optional: poll `GET /orders/:id` or `GET /invoices/:id` every 2–3s until `pdfUrl` is set (cap ~60s).
- Backfill stuck invoice: `POST /orders/:id/retry-fulfill` (student, own order).

Bitrix lead upsert/convert remains on the `bitrix-lead` queue (unchanged).

---

## 6. Admin packages

### List — `upgradeTargets`

`GET /rodha/api/website/admin/packages?page=1&limit=100`

Each item includes:

```json
"upgradeTargets": [
  {
    "id": 130,
    "slug": "…",
    "title": "…",
    "graphyTitle": "…",
    "price": 28999,
    "discountedPrice": 28999,
    "isActive": true,
    "sortOrder": 0
  }
]
```

### Dropdown — active only

`GET /rodha/api/website/admin/packages/dropdown?page=1&limit=100`

Always filters `isActive: true` (query `isActive` is ignored for this endpoint).

---

## Curls (local)

```bash
# Enrollments (pendingUpgrade)
curl -s 'http://localhost:5000/rodha/api/website/student/enrollments' \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H 'x-website-category-id: 1'

# Resume
curl -s -X POST 'http://localhost:5000/rodha/api/website/student/packages/upgrades/payments/resume' \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"orderId":47}'

# Cancel
curl -s -X POST 'http://localhost:5000/rodha/api/website/student/packages/upgrades/cancel' \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"orderId":47}'

# Orders (kind)
curl -s 'http://localhost:5000/rodha/api/website/student/orders?page=1&limit=20' \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# Retry fulfill / re-queue PDF
curl -s -X POST 'http://localhost:5000/rodha/api/website/student/orders/46/retry-fulfill' \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# Admin list + dropdown
curl -s 'http://localhost:5000/rodha/api/website/admin/packages?page=1&limit=100' \
  -H "Authorization: Bearer $ADMIN_TOKEN"
curl -s 'http://localhost:5000/rodha/api/website/admin/packages/dropdown?page=1&limit=100' \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```
