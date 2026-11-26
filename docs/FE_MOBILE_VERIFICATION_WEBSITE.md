# Website FE — Mobile verification OTP & soft-block

Guide for **cat.rodha.co.in / website** clients.  
Companion: [Buddy FE guide](./FE_MOBILE_VERIFICATION_BUDDY.md) · Postman: `postman/Rodha_Mobile_Verification_SoftBlock.postman_collection.json`

Related: [Email verification (Website)](./FE_EMAIL_VERIFICATION_WEBSITE.md)

Base URL (local): `http://localhost:5000/rodha/api`  
Docs test student (local DB): `mobile.verify.docs@rodha.local` / `Student@123`  
Sample mobile used in capture: `9685711771`

---

## What to build

1. After login, read `GET /auth/me` → `mobileVerification` (and `emailVerification` first).
2. If `mobileVerification.required && !overdue` → show **verify-mobile popup** (enter mobile → send OTP → enter OTP).
3. Soft-block `MOBILE_VERIFICATION_REQUIRED` → blocking “please verify mobile” UI (same OTP flow).
4. Do **not** change mobile via `PATCH /auth/me/details` — that returns 400; always use mobile-verification OTP APIs.

**Gate priority:** email → **mobile** → registration.

---

## Who must verify

Students with `mobileVerified !== true` (including `null` mobile / Google users).  
Clock: `signupAt` + admin hours (`mobileVerificationDeadlineHours`, default **72**).

After verify, mobile is **locked** (cannot change via student APIs).

---

## APIs (Website)

### 1) Profile / popup

`GET /auth/me`

```json
{
  "mobileVerification": {
    "required": true,
    "verified": false,
    "overdue": false,
    "deadlineAt": "2026-11-27T05:53:39.885+05:30",
    "signupAt": "2026-11-24T05:53:39.885+05:30"
  }
}
```

Also on `GET /website/student/dashboard` (`x-website-category-id`).

| Field | UI |
|--------|-----|
| `required && !overdue` | Non-blocking popup |
| `required && overdue` | Soft-block; gated APIs return 201 |
| `verified` / `!required` | Hide mobile verify UI; number locked |

### 2) Send OTP

`POST /auth/mobile-verification/otp/send`  
Body: `{ "mobile": "9685711771" }` (10-digit Indian)

```json
{ "success": true, "message": "OTP sent successfully" }
```

Number is **not** saved on `users` until verify succeeds.

Errors (captured):

| Status | Message |
|--------|---------|
| 400 | Mobile number is locked and cannot be changed |
| 409 | Mobile number is already verified on another account |
| 429 | Too many active OTPs… |

Unverified number on another student: send is allowed; verify **claims** it (clears other account).

### 3) Verify OTP

`POST /auth/mobile-verification/otp/verify`  
Body: `{ "mobile": "9685711771", "otp": "123456" }`  
Local/dev OTP is often `123456`.

```json
{
  "success": true,
  "message": "Mobile verified successfully",
  "data": { "mobileVerified": true, "mobile": "9685711771" }
}
```

Then refresh `/auth/me`.

### 4) Soft-block (Website)

HTTP **201** — do **not** logout:

```json
{
  "success": false,
  "message": "Please verify your mobile number to continue on the Rodha website. Request an OTP and enter it to verify.",
  "errors": {
    "code": "MOBILE_VERIFICATION_REQUIRED",
    "deadlineAt": "2020-01-01T01:00:00.000+05:30",
    "signupAt": "2020-01-01T00:00:00.000+05:30",
    "client": "website"
  }
}
```

### 5) Still callable while soft-blocked

- `GET /auth/me`
- `POST /auth/mobile-verification/otp/send|verify`
- email-verification routes, registration, profile, logout

### 6) Do not use for mobile change

`PATCH /auth/me/details` with `mobile` → **400**:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "mobile": ["Use mobile verification OTP APIs to set or change mobile number"]
  }
}
```

Use that endpoint for `stateId` only.

---

## Suggested Website UX

```text
GET /auth/me
  → if emailVerification overdue/required → email flow first
  → else if mobileVerification.required:
       overdue ? blocking sheet : popup
       collect mobile → send OTP → verify OTP → refresh me
  → else if registration overdue → registration form
```

---

## Admin

- `GET/PATCH /settings/mobile-verification-deadline`  
  Body: `{ "mobileVerificationDeadlineHours": 72 }`

---

## Curl

```bash
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/rodha/api/auth/me

curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"mobile\":\"9685711771\"}" \
  http://localhost:5000/rodha/api/auth/mobile-verification/otp/send

curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"mobile\":\"9685711771\",\"otp\":\"123456\"}" \
  http://localhost:5000/rodha/api/auth/mobile-verification/otp/verify
```
