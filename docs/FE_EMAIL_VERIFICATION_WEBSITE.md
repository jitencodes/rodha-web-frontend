# Website FE — Email verification OTP & soft-block

Guide for **cat.rodha.co.in / website** clients.  
Companion: [Buddy FE guide](./FE_EMAIL_VERIFICATION_BUDDY.md) · Postman: `postman/Rodha_Email_Verification_SoftBlock.postman_collection.json`

Base URL (local): `http://localhost:5000/rodha/api`  
Docs test student (local DB): `email.verify.docs@rodha.local` / `Student@123`

---

## What to build

1. After login, read `GET /auth/me` → `emailVerification`.
2. If `required && !overdue` → show **verify-email popup** (send OTP / enter OTP).
3. If any student API returns soft-block `EMAIL_VERIFICATION_REQUIRED` → full-screen / blocking “please verify email” UI (same OTP flow).
4. If soft-block `REGISTRATION_REQUIRED` → send student to complete the **registration form** (not email OTP).

Priority when both overdue: **email first**, then registration.

---

## Who must verify

Student must verify when **both** are true:

- `emailVerified !== true`
- no `googleId` (Google signup/login is treated as verified)

Clock: `signupAt` (`User.createdAt`) + admin hours (`emailVerificationDeadlineHours`, default 72).

---

## APIs (Website)

### 1) Profile / popup source of truth

`GET /auth/me`  
Header: `Authorization: Bearer <studentToken>`

Relevant fields (captured local):

```json
{
  "emailVerification": {
    "required": true,
    "verified": false,
    "overdue": false,
    "deadlineAt": "2026-11-27T03:53:14.591+05:30",
    "signupAt": "2026-11-24T03:53:14.591+05:30"
  },
  "registration": {
    "completed": false,
    "required": false,
    "overdue": false,
    "deadlineAt": null,
    "firstEnrollmentAt": null
  }
}
```

| Field | Meaning for UI |
|--------|----------------|
| `required: true` | Show verify affordance / popup |
| `overdue: false` | Soft reminder popup — APIs still work |
| `overdue: true` | Soft-block — gated APIs return 201 |
| `verified: true` / `required: false` | Hide email verify UI |

Also on `GET /website/student/dashboard` (header `x-website-category-id`): same `emailVerification` + `registration` objects.

### 2) Send OTP

`POST /auth/email-verification/otp/send`  
Auth: student Bearer. Body: `{}` (OTP always goes to the logged-in student’s email).

```json
{ "success": true, "message": "OTP sent successfully" }
```

Common errors: `400` already verified · `429` too many active OTPs · `401` invalid session.

### 3) Verify OTP

`POST /auth/email-verification/otp/verify`  
Body: `{ "otp": "123456" }` (6 digits). Local/dev OTP is often `123456`.

```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": { "emailVerified": true }
}
```

Then refresh `/auth/me` (or set local state verified).

### 4) Soft-block response (Website)

HTTP **201** (not 401/403 — do **not** logout):

```json
{
  "success": false,
  "message": "Please verify your email to continue on the Rodha website. Check your inbox for the OTP, or request a new one.",
  "errors": {
    "code": "EMAIL_VERIFICATION_REQUIRED",
    "deadlineAt": "2020-01-01T01:00:00.000+05:30",
    "signupAt": "2020-01-01T00:00:00.000+05:30",
    "client": "website"
  }
}
```

Registration soft-block (email already OK):

```json
{
  "success": false,
  "message": "Please complete the mandatory registration form on the website to continue.",
  "errors": {
    "code": "REGISTRATION_REQUIRED",
    "deadlineAt": "2020-01-01T01:00:00.000+05:30",
    "firstEnrollmentAt": "2020-01-01T00:00:00.000+05:30",
    "client": "website"
  }
}
```

**UI rule:** branch on `errors.code` + show `message` (or your own copy keyed by code). Use `client === "website"` as confirmation.

### 5) Still callable while soft-blocked

- `GET /auth/me`
- `POST /auth/email-verification/otp/send`
- `POST /auth/email-verification/otp/verify`
- `GET|POST /website/student/registration`
- `GET /website/student/profile`
- `POST /auth/logout`

---

## Suggested Website UX flow

```text
Login / session restore
  → GET /auth/me
  → if emailVerification.required && !emailVerification.verified:
       if overdue → blocking verify screen
       else → non-blocking popup (dismissible until deadline)
  → else if registration.required && !registration.completed:
       if overdue → blocking registration screen
       else → registration reminder
```

On any API `success: false` + `errors.code`:

| code | Action |
|------|--------|
| `EMAIL_VERIFICATION_REQUIRED` | Open verify OTP UI; show website message |
| `REGISTRATION_REQUIRED` | Route to registration form |

---

## Admin (CMS) — hours after signup

- `GET /settings/email-verification-deadline`
- `PATCH /settings/email-verification-deadline` `{ "emailVerificationDeadlineHours": 72 }`  
  Permissions: `read_system_settings` / `write_system_settings`

Local captured value: **72** hours (admin `admin@rodha.com`).

---

## Curl cheat sheet (Website)

```bash
# Me
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/rodha/api/auth/me

# Send OTP
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{}" http://localhost:5000/rodha/api/auth/email-verification/otp/send

# Verify
curl -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"otp\":\"123456\"}" http://localhost:5000/rodha/api/auth/email-verification/otp/verify

# Soft-block probe
curl -H "Authorization: Bearer $TOKEN" -H "x-website-category-id: 1" \
  http://localhost:5000/rodha/api/website/student/dashboard
```
