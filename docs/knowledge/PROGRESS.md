# Progress Tracker

**Last updated:** 2026-11-27 (rich text descriptions, searchable state select, category slider card height)
**Phase:** Phase 1 — Active Development

Update this file after every meaningful implementation task.

---

## Completed

- **Rich text descriptions, searchable state select, slider cards (2026-11-27):**
  - **Descriptions:** the package description on `/courses/[slug]` and the course description (`syllabus`) on `/account/courses/:id` render as editor content through `RichTextContent` (paragraphs, lists, links, headings; website and account themes). Plain-text descriptions still render as paragraphs. The hardcoded "Check our demo classes for free" link is removed; admins add it inside the description. The hero snippet and `shortDescription` (cards, SEO) use `htmlToPlainText`.
  - **State select:** `StateSelectField` (auth, guest checkout, checkout location, update state) uses `DropdownSelect searchable`: the filter input is focused on open, prefix matches come first, ↑/↓/Enter select.
  - **Category courses slider:** carousel items stretch to the tallest card, so all cards have the same height and the pricing row sits at the bottom.
  - **MBA copy:** courses badge "MBA Courses", title "Flagship Programs".

- **Pending package upgrade + invoice PDF (2026-11-26):** per `docs/FE_INTEGRATION_PACKAGE_UPGRADE_PENDING_INVOICE.md` and the `Rodha_Package_Upgrade_Pending_Invoice_FE` Postman collection.
  - **Pending upgrade:** closing Razorpay leaves the upgrade PENDING and the API returns `pendingUpgrade` with `availableUpgrades: []`. Manage Packages keeps the card CTA ("Complete upgrade") and shows `PendingUpgradeNotice` (Complete payment / Cancel upgrade). `/account/packages/upgrade` shows the same panel instead of the options and skips the quote (it would 409). Resume → `/api/account/packages/upgrades/resume` → Razorpay → existing verify; 409 (session missing) leaves only Cancel. Cancel → `/api/account/packages/upgrades/cancel` → refresh, options return. Dismissing Razorpay in upgrade checkout now lands on the pending panel.
  - **Invoices:** every paid order has an active Download Invoice. When `invoices[].pdfUrl` is null the button polls `/api/account/orders/:id/invoice` (3s, 60s cap) in the background if an invoice row exists; a click calls `retry-fulfill` (re-queues the PDF), uses its `invoice.pdfUrl` or polls, then opens the PDF. Unpaid orders keep a disabled button. Orders with `kind: UPGRADE` are labelled "Upgrade".
- **Archive courses, email / mobile verification, WEBSITE_PACKAGE add-ons, registration gate (2026-11-25):**
  - **Archive:** `/account/courses?tab=archived` (count in the tab, same filters / pagination as Continue Watching, no live classes or quick actions). `CourseArchiveButton` on cards and `/account/courses/:id`, with Undo. An emptied last page redirects to the previous one. Continue Watching links to Archived when a filter finds nothing.
  - **Verification:** `StudentGateProvider` (was `RegistrationGateProvider`) reads `GET auth/me` through `/api/account/gate-status` and shows one gate at a time: overdue first, then email → mobile → registration. Reminders are dismissible (1h); overdue ones block `/account`. `VerifyContactDialog` sends and verifies the OTP through `/api/account/verification/[channel]/send|verify`.
  - **Soft-block:** 201 + `errors.code` becomes `ApiError` 423 (`SOFT_BLOCK_STATUS`); `fetchAuthed` opens the matching dialog on 423. After a block is cleared the page reloads.
  - **Mobile is OTP only:** `PATCH auth/me/details` rejects `mobile`, so `UpdateStateDialog`, `RequireStateGate` and `/api/account/state` are state only. The pay gate and the profile page use `VerifyContactDialog`. A verified number shows a Verified badge and cannot be edited.
  - **Add-ons:** type `WEBSITE_PACKAGE` ("Package", linked package title) in checkout, upgrade, Manage Packages and My Orders.
  - **Registration:** `required` now means "enrolled in a registrationActive package and not submitted", and drives only the popup and the block. Any student who has not submitted can open the form from the sidebar or profile.
  - **Toasts:** the second `Toaster` in `AccountShell` is gone (the root `AppToaster` covers it); each toast was mounted twice.
- **Course change CTA states + compact account cards (2026-11-25):**
  - **CTA on `/account/courses/:id`:** eligibility is per student, so "Course switch under review" shows only when `pendingRequestId` is a request from this course (matched in the request history, `pendingForCourse`). Any other `canRequest: false` (cooldown, limit, request for another course) shows the CTA disabled with `blockedMessage` and the next allowed date. Feature off, or nothing to switch to, hides it.
  - **Cards below 2xl:** smaller price / coupon / CTA text on `AccountRecommendedCard` and on Buy Courses (`CourseCardV2 compactPricing`). Dashboard Continue Watching and Recommended stay 2 columns until 2xl, then 4.
- **16:9 course images, coupon tooltip, guest discount, orders pagination (2026-11-24):**
  - **16:9:** every course/package image is `aspect-video`: `CourseCardV2`, continue watching, recommended, cart, checkout, orders (list + dashboard preview), course switch requests, package upgrade, and `PACKAGE` rows in global search. Admin uploads are 16:9, so `object-cover` does not crop.
  - **`ClampTooltip`** also detects horizontal overflow (single-line `truncate` text), so the coupon chip on `AccountRecommendedCard` shows its tooltip.
  - **Request Discount** on `CoursePurchaseCard` is hidden for logged-out visitors.
  - **`/account/orders`** uses the API pagination (`?page=`, 10 per page); a page past the end redirects to the last one and a failed load shows an error instead of "no orders". Course switch requests (10), Continue Watching (8) and Buy Courses (8) already paginate.
- **Checkout sidebar + guest purchase + add-ons (2026-11-23):** one checkout module for the sidebar and `/account/checkout`.
  - **Sidebar:** Buy Now on the package page (`CoursePurchaseCard`) opens `CheckoutDrawer` instead of redirecting: product card, add-ons, coupon + offers, Request Discount, price summary, sticky pay footer, same confetti / full-screen coupon overlay. Buy Now on every course card (listing, category slider, related, account, dashboard) goes to `/courses/:slug?checkout=1`, which opens the sidebar on arrival; closing it drops the param. `/api/checkout/buy` → `/account/checkout` remains for packages without a slug and old links. The promo popup waits while a dialog is open.
  - **Guests** (`Rodha CR Single page Purchase Flow` Postman): name, email, mobile, state (auto-detected) → `identify` → the methods in `authOptions` (email OTP, password, Google; `email-otp/resend` is used for the first send too, automatically, then with a 30s cooldown) → the same checkout. An expired session falls back to the guest form. The typed state is reused at pay (no GPS prompt). `router.refresh()` waits until the drawer closes so the registration gate cannot open over it.
  - **Add-ons** (`Rodha_Package_Addons_FE` Postman): `AddonPicker` updates the cart; owned ones are disabled, withdrawn ones are flagged and removable. Buy later for owned packages (package page, Manage Packages). Upgrade quote adds `addonIds` on top of the quote amount. My Orders lists add-ons and offers Retry delivery on `graphyAssignStatus: FAILED`.
  - **Errors:** BFF keeps API statuses; 400/404/409 reload the cart and show the reason. A payment that cannot be verified blocks a second payment and links to My Orders. Upgrade quote errors (400/409) are shown instead of a 404.
- **Registration photo, category headers, Recommended rail (2026-11-20):**
  - **Passport photo:** frontend limit aligned to backend — JPG/PNG only, max **2 MB** (`passport-photo.ts`); re-validated on final submit; BFF registration errors return field `errors` via `bffErrorResponse` and map to the upload field (no more unclear toast-only “passport photo must be”).
  - **`x-website-category-id`:** now on remaining account student APIs — cart get/clear/add, payment verify, orders, profile, password, registration GET/POST; checkout BFF `buy` / `verify` forward category; discount dialog/drawer always send the header (default `1`); `apiDelete` / `apiPostFormData` pass extra headers.
  - **Dashboard Recommended for You:** horizontal scroll below `sm` with `min-w-[200px]` cards; from `sm` a 2/4-col grid; coupon code truncates in the dashed box with `ClampTooltip` on hover.
- **Course switch requests (2026-11-23):** per `docs/FE_INTEGRATION_COURSE_CHANGES.md`. "Request course change" on `/account/courses/:id` opens a searchable, filtered, paginated dialog (Continue Watching card + Change CTA) and a confirm dialog with an optional reason. `/account/course-changes` lists requests with status filter, search, pagination and Cancel. Listing params are sent already; the service filters locally until `docs/API_CHANGES_COURSE_CHANGE_LISTING.md` ships.
- **Manage Packages / package upgrade (2026-11-20):** student APIs from `Rodha CR package upgrade` Postman — `GET /student/packages`, quote, checkout, verify.
  - Sidebar **Manage Packages** → `/account/packages` lists enrolled packages with `CourseCardV2` (Available upgrades CTA when targets exist).
  - `/account/packages/upgrade` picks a target, shows iconized quote summary, then pays via BFF (`/api/account/packages/upgrades/checkout` + verify); `mode=free` / payable ≤ 0 skips Razorpay (same success page as buy checkout).
- **Checkout offers dialog + purchase card polish + PREV_ATTEMPT (2026-11-20):**
  - Checkout coupon heading is dynamic (`Have a coupon?` / `Coupon applied · {code}`); Available offers moved into `PackagePromocodeOffers` account-variant dialog with Apply.
  - Course sticky shell no longer uses `max-h` + `overflow-y-auto` (page scrolls instead of nested card scrollbar).
  - Purchase card shows **Best offer** (or Applied) badge + code chip instead of `Coupon:`.
  - PREV_ATTEMPT: score type is read-only text (not a placeholder input); vertical options derive from exams when masters verticals are empty; clearer exam/year placeholders; select menu portal z-index raised.
- **Purchase card coupon dialog (2026-11-20):** package detail no longer lists all codes on the sticky card. `PackagePromocodeOffers` is a compact **View available offers (N)** CTA that opens a light `Modal` with the full list (Best offer / Applied / saving / valid till). The card keeps a single applied-coupon chip next to price (no duplicate list row on the card). Card body no longer scrolls for offers.
- **Package offers + category headers + enquiry categories (2026-11-20):**
  - **Package detail Available offers:** logged-in course detail fetches `getPackagePromocodes` (dialog CTA on the purchase card); apply still happens on checkout. PENDING Request Discount CTA uses `Under review — {reviewSlaText}` via `discountStatusMessage`.
  - **Account student GETs:** dashboard + student courses/filter-options/chapters/quick-actions/detail now send `x-website-category-id: 1` (MBA default) via `websiteCategoryHeaders()`. Package promocodes keep package vertical (fallback 1).
  - **Enquiry dropdowns:** `HeroCounsellingForm`, `LeadCaptureForm`, and `ContactForm` use `categoriesAtom` (same active list as the header); no static `CATEGORIES` fallback.
- **Promocodes + Discount Requests, student website (2026-11-19):** per `docs/FE_INTEGRATION_PROMOCODES_AND_DISCOUNT_REQUESTS.md` and the `Rodha_Promocodes_FE` / `Rodha_Discount_Requests_FE` Postman collections (admin panel side is in the separate admin repo).
  - **`x-website-category-id`:** `apiGet` accepts `headers`; `src/lib/api/website-category.ts` builds the header. Package-scoped calls send the package `websiteCategoryId` (now mapped from package detail); calls with no package (dashboard list, form config, proof links) send the default `1`.
  - **Checkout (cart) coupons:** the coupon box sends any typed code as `{ code }` (bulk/support codes work), listed offers apply by `promocodeId` from a new Available offers list (Best offer = `suggestedPromocodeId`, estimated saving, valid till). 400/409 API messages show under the input. A 409 at pay shows the message and refreshes the cart.
  - **Request Discount CTA** (`DiscountRequestCta`): course purchase card (below Buy Now; paid, not enrolled; logged-out → login) and checkout aside. States follow `GET /student/discount-requests/current` (request / resubmit / under review / approved + countdown / used).
  - **Discount form** (`DiscountRequestDialog`): config-driven COLLEGE / ACADEMIC / EWS / PREV_ATTEMPT sections built from `account/forms/*`; client validation mirrors the backend (`src/lib/account/discount-request-form.ts`); multipart via BFF; API `errors[field][0]` shown per field. Resubmit pre-fills from the rejected request and keeps proofs that are not re-uploaded.
  - **Dashboard → My Discount Requests** (`DiscountRequestsSection`, hidden when empty): cards with status, Resubmit / Buy now / Request again, and a detail drawer with proofs (signed link fetched on each click). `?discountRequestId=` (email link) opens the drawer.
  - **BFF:** `/api/discount-requests` (GET list, POST submit), `/config`, `/current`, `/[id]`, `/[id]/resubmit`, `/[id]/files/[fileId]`. `/api/checkout/promocode` accepts `code` or `promocodeId` and keeps 400/409 statuses; `/api/checkout/pay` keeps 409.
- **Hydration fixes (2026-11-18):** `PromotionalBanner` wraps CMS announcement HTML (which contains `<p>`) in `<div>`s instead of `<p>`/`<span>`, which had produced invalid nesting and a hydration mismatch on every page with the banner. `useCountdown` reads the clock through `useSyncExternalStore` with a `null` server snapshot, so SSR and hydration render a stable placeholder (`ready: false`) and the live digits appear after hydration (used by `PromotionalBanner` and `CountdownTimer`). The root `<html>` has `suppressHydrationWarning` for attributes injected by browser extensions (e.g. Scribe recorder: `style="filter:none"`, `data-scribe-recorder-ready`).
- **Listing scroll, search loading UX, forum group picker (2026-11-18):**
  - **Listing scroll:** `/blog`, `/results`, `/testimonials`, `/success-stories` and `/resources` no longer jump to the hero when search, category or page changes. `BlogToolbar` navigates with `scroll: false`, and once the new results render it scrolls the toolbar back under the sticky header only if the toolbar is off-screen. `Pagination` takes an optional `scroll` prop, and `ListingEmptyState` "Clear filters" uses `scroll={false}`.
  - **`GlobalSearchDialog`:** shows a pending state as soon as the query or filter changes (spinner in the input plus an indeterminate `.search-progress-bar`). A filter switch shows shimmer rows, while typing within a filter keeps the previous results dimmed. Filter switches fetch without the 300ms debounce, and results are cached per filter and query while the dialog is open. The empty state offers "Search all categories". Filter tabs (`role=tab`), Clear/Close, quick links and results all use `cursor-pointer`. The dialog body unmounts on close, so its state resets.
  - **Create Topic:** the Group field uses `DropdownSelect` (`variant="light"`, full width) instead of a native `<select>`.
- **Discussion Forum dashboard design (2026-11-17):** Restyled to `referrence/ui/discussion/redesign/Rodha Discussion Forum Dashboard.png`:
  - **Header:** logo | divider | Feed (active pill + orange underline) · Groups | wide search | Rodha Buddy (orange outline + headset), Sign In (user icon), Join Now.
  - **Layout:** flat sidebar with a right divider; large plain page heading; white rounded group cards (icon, name, description, See All Topics); normal-case table header; square author initials.
  - **Hover:** rows tint orange and the title turns orange and underlines; the whole row is clickable via a stretched title link. Right-rail lists highlight on hover too.
  - **Right rail:** white Latest/Best Posts cards with View More.
  - **Footer:** the forum now uses the main website `Footer`.
- **Discussion Forum light theme + scope trim (2026-11-17):**
  - **Theme:** dual tone like the website. Dark `#191919` header, footer and section/rail title bands around a cream page, white cards and a beige table header row; topic, group and rail rows alternate white / `bg-section-beige`. The Quill editor, `ForumMessageComposer` and `Breadcrumb` (`variant="light"`) are light.
  - **Author column:** `ForumTopicTable` shows the author's profile photo or initials (`ForumAvatar`, now a `<span>` so it is valid inside text).
  - **Removed from the website:** study groups and channels (`[slug]/groups`, `[slug]/channels`, `[slug]/tags`, `DiscussionForumShell`, `DiscussionForumSpace*`, `DiscussionForumTags`, `useGroupChatRealtime`), along with the group-chat service/mapper/ui helpers, the chat-bar composer variant and the mock forum data. `/api/discussion-forum/messages` now requires `topic_slug`.
- **Discussion Forum rebuild, GMAT Club–style (2026-11-17):** `/discussion-forum/*` has its own chrome (`discussion-forum/layout.tsx` + `ForumHeader`). `SiteFrame` skips the website header, footer, promo and toasts there. `ForumPageLayout` gives three columns: sticky `ForumSidebarNav` (Feed, collapsible Groups ×6, See more), the feed, and `ForumRightRail` (Latest/Best Posts), which stacks under the feed below `xl`. On phones the nav lives in the header drawer.
  - **Home:** the 3 most recently active groups (or `isFeatured` once the API sends it) as `ForumGroupSection` (6 topics in a `ForumTopicTable`, then See more), followed by Explore more discussions (`ForumGroupList`).
  - **Group pages:** new `/discussion-forum/groups` (search + pagination); `/discussion-forum/[slug]` is a topic table with API search, sorts (`lastActivityAt`/`createdAt`/`messageCount`/`title`) and pagination.
  - **Topic page:** `ForumTopicThread`, a GMAT post view with an author column. Replies nest by `parent_message_id` (SSR loads top level + direct replies; deeper levels via `GET /api/discussion-forum/messages`), with like/dislike, inline reply, and edit/delete of your own replies.
  - **Create Topic:** new `/discussion-forum/ask` with a group picker; the per-group `/[slug]/ask` stays.
  - **Columns:** Likes/Views appear only when the API returns `reactionTypeCount`/`viewCount` on topics. Home Latest/Best Posts wait for the feed API. See `docs/discussion-api-gaps.md`.
  - **`cn()` fix:** it now uses `extendTailwindMerge` with the custom `text-*` font-size scale, so `text-caption`/`text-body-sm` are no longer dropped when a text color follows them (site-wide fix).
  - **Removed:** `DiscussionForumFeed`, `DiscussionForumQuestionCard`, `DiscussionForumsDirectory`, `DiscussionForumDetail`.
- **Enrollment refresh removed (2026-11-13):** The backend now syncs enrollments itself. The website no longer calls `POST api/website/student/enrollments/refresh`: removed `useEnrollmentRefresh` (4-minute polling and `router.refresh()` in `AccountShell`), the `/api/account/enrollments/refresh` BFF route, the calls after free checkout (`/api/checkout/pay`) and Razorpay verify (`/api/checkout/verify`), and `refreshEnrollments` from the cart service.
- **Hero duplicate banner image fix (2026-11-13):** `BannerImageLink` used to return a bare fragment when the banner had no `redirectUrl`, which dropped its `className`. The mobile hero image lost `lg:hidden` and showed on desktop beside the desktop background image on `/about`, `/faculty`, and `/team`. It now wraps children in a `div` with that `className` when no link is set.
- **UTM retention + registration fixes (2026-11-12):** `middleware.ts` now runs on all pages plus `/api/checkout/buy` and writes the `rodha_utm` cookie server-side whenever the request URL has `utm_*` params, so UTMs survive server redirects (auth gate, Buy Now → login) that run before client JS. `UtmCapture` still writes it client-side for soft navigations. A new UTM set always replaces the stored one (keys lowercased, never merged). `/api/checkout/pay` uses one source (`resolveCheckoutUtm`: body UTM if present, else cookie) instead of merging cookie + header + body. Registration: LinkedIn accepts messy profile URLs (no scheme, `http`, `in.`/`m.` subdomain, query/hash, `/details/…`) and normalizes to `https://www.linkedin.com/in/<username>` on blur and on submit (`normalizeLinkedInUrl`); input is `type="text"` + `inputMode="url"` so native URL validation no longer blocks submit; error text is "URL must start with https://www.linkedin.com/in/(username)". Graduation Year options run to current year + 3 (`profileGraduationYearOptions`). `classifyCurrentStatus` no longer treats "not working" / "non-working" / "fresher" labels as working; only working professionals get work experience locked to Yes (`workExperienceLocked`, also enforced in validation), graduates can pick Yes or No. Post Graduation now uses the `POST_GRADUATION` education master like Graduation: **PG Stream** select (`pgStream`) and **PG Degree & Specialization** select from that stream's degrees (was free text); changing stream clears the degree; no extra specialisation text input. Profile detail shows PG Stream.
- **Search, Free Resources, sitemap index, listing banners (2026-11-05):** Search buttons restored in `Header` (desktop + mobile) and `MobileNav`; `AccountHeader` search was already visible. Header, mobile nav and footer Free Resources now link to `/resources`. `/sitemap.xml` is a sitemap index (`src/app/sitemap.xml/route.ts`) listing `/sitemaps/sitemap/{static,categories,courses,faculty,blogs}.xml`. `BlogHeroSection` takes `imageSrc`: `/resources` uses `resources-hub-hero.png`; `/results`, `/success-stories` and `/testimonials` use `students-hero.png`; `/blog` keeps `Blogs.png`.
- **Banner links, registration draft, purchase toasts (2026-11-03):** CMS banner `redirectUrl` (via `mapWebsiteBanner`) makes the hero image clickable on home, `/category/[slug]`, `/about`, `/faculty`, and `/team` through `BannerImageLink` (internal → `next/link`, absolute → new tab). About/Faculty/Team desktop background images take clicks through the content layer's empty space. Category hero: `withCategoryLandingDefaults` rebuilds `hero` field by field, so it must carry `redirectUrl` (it was dropped there). `normalizeBannerRedirectUrl` makes a missing/non-string value `null` (no link), keeps `https://` absolute, adds https to `www.`, and prefixes `/` to relative paths like `courses/x`. Account sidebar shows **Complete registration** under My Profile while the gate reports registration incomplete (`useRegistrationIncomplete`, published by `RegistrationGateProvider`); it opens the registration dialog. The registration dialog saves an unsubmitted draft per account email (`registration-draft.ts`, 30-day TTL): field values in localStorage (read-only account fields excluded) and the passport photo in IndexedDB (`rodha-registration` / `passport-photos`); both restore on open. A successful submit, or the gate reporting `completed`, deletes both. Passport photo is limited on the frontend to JPG/JPEG/PNG up to 5 MB (`passport-photo.ts`), with inline errors for wrong type, empty file, or oversize. `GET api/website/recent-purchases` now maps `data.items[]` (`userName`, `itemName`, `itemSlug`, `itemType`, `purchasedAt`); `PurchaseToast` shows them one after another (`NEXT_PUBLIC_PURCHASE_TOAST_MS` open, `NEXT_PUBLIC_PURCHASE_TOAST_GAP_MS` gap, loops when more than one), and package items link to `/courses/{slug}`.
- **Google auth click debounce (2026-10-29):** `GoogleContinueButton` ignores repeat GIS credentials for 2s and locks pointer events; `AuthScreen.handleGoogle` uses a sync in-flight ref so duplicate login/signup requests cannot start.
- **Profile detail course list (2026-10-28):** `ProfileDetailView` shows enrolled courses as a bullet list from `purchasedCourses` titles (`courseEnrolledLabels`) instead of a single comma-joined `courseEnrolledLabel`.
- **Registration searchable selects + Class 12 rules (2026-10-28):** `AccountSelect` / `AccountMultiSelect` use `react-select` with orange account theme (searchable, portaled menus). Step changes scroll the dialog body to top. UG/graduate (and working) hide Class 12 Appearing and default to Passed; when Appearing is chosen, graduation / PG / work are not required or shown.
- **SEO, sitemap, promo banner, tooltip, View All (2026-10-27):** `ClampTooltip` flips above/below on viewport space. Category landing View All → `/results|testimonials|success-stories?category={slug}`. HTML `/sitemap` + modular XML via `generateSitemaps` (static/categories/courses/faculty/blogs) + `robots.ts` (disallow account/api/auth). Promo dialog uses `GET api/website/promotional-banner` (date window; IMAGE link; VIDEO thumbnail → autoplay 1.5s, click opens YouTube). SEO gaps: team/legal JSON-LD, dynamic category keywords, CollectionPage on listings, noindex auth/account. Branch `fix/seo-sitemap-promo-tooltip`.
- **Registration multi-select portal (2026-10-27):** `AccountMultiSelect` (Target Exams / Target Colleges) portals into nearest `.account-shell` with z-index above the registration dialog and solid CSS-var fallbacks, fixing transparent menus and unselectable options. Shared `getAccountPortalParent` also used by account `DropdownSelect`.
- **Registration form select height (2026-10-27):** `AccountSelect` trigger uses form-only `accountFormSelectTriggerClassName` so dropdown height matches inputs (`py-2.5` / `text-body` / account radius). Account filter toolbars keep default `DropdownSelect` `h-9`. `AccountMultiSelect` (Target Exams) menu/chevron aligned with account select styling.
- **Registration gate open conditions (2026-10-27):** Manual open (profile CTA / `rodha:open-registration`) shows the dialog whenever `completed` is not true — including when the dashboard omits `registration` (maps to `required: false`). “Already complete” toast only when `completed === true`. Auto-pop still requires `required` plus overdue/reminder rules so a missing registration object does not auto-open.
- **Registration gate polling (2026-10-26):** Site-wide `RegistrationGateProvider` polls dashboard registration status every 2 min. Shows registration dialog when `required`; 1-hour dismiss reminder; overdue is mandatory on `/account/*` with deadline/overdue header + toast on dismiss. Soft-block `REGISTRATION_REQUIRED` (201) handled in BFF + dashboard SSR.
- **GTM purchase dataLayer (2026-10-26):** After successful Razorpay verify or free checkout, success page pushes `event: "purchase"` with `ecommerce.transaction_id` / `value` / `currency: "INR"` from the order (once per transaction). Meta Pixel Purchase uses the same amounts.
- **Student registration + profile detail (2026-10-26):** Replaced Complete/Edit Profile with Postman registration APIs. Masters and gate from `GET api/website/student/registration`; one-time multipart submit via BFF `POST /api/account/registration`. 3-step dialog (sheet A–F / G–J / K–N) auto-opens when not submitted. Submitted students get View Profile → `/account/profile/detail` (hero + personal/contact/address + Academics / Work / Books & others tabs) from expanded `GET api/website/student/profile`. Account form primitives: MultiSelect, RadioGroup, Checkbox, DateField, FileUpload.
- **Profile enhancements (2026-10-23):** Merged `checkout_utm_and_state` into `milestone_three` (kept WEB channel + UTM/`stateName`; removed temporary live-class time fix). My Profile had Complete/Edit Profile (superseded by registration flow), Request email update (stub BFF), and auth banner logo links to `/`.
- **Checkout state and UTM (2026-10-19):** Continue to Pay sends stored `utm_*` params and a checkout-only `stateName` from GPS reverse geocoding, or from the states dropdown when location permission or geocoding is unavailable. Skipping the dialog still checks out. The value is not saved on the student profile. A missing profile state no longer blocks payment; a missing mobile number still does. The pay request includes the `rodha_utm` cookie fields in its JSON body, and the pay route merges that body with the cookie header before calling checkout. Checkout also sends `channel: WEB` / `x-channel: WEB`.
- **Global search, promo, checkout channel, listing APIs (2026-10-15):** Header and account search open one dialog (click or Ctrl/Cmd+K) through `GET /api/search`. Promo dialog and recent-purchase toast mount on the public site and hide when their APIs are empty. `/results`, `/testimonials`, `/success-stories`, and `/resources` read their website list endpoints. Backend gaps are in `docs/api-requirements-website-ui.md`.
- **Listing pages (2026-10-14):** `/results`, `/testimonials`, `/success-stories`, and `/resources` reuse the blog banner (`Blogs.png`), category toolbar, and light pagination. Page sizes are two full desktop rows: 10, 6, 6, and 8. `TestimonialCardV2` keeps a 5-line clamp and shows the full quote in `ClampTooltip`. Footer links point at the four routes.
- **Production sync plus checkout, GPS, and tracking (2026-10-13):** Merged production features onto main. Checkout shows a coupon success overlay, empty account state can prefill from GPS, signup and mobile updates require an Indian mobile number, and GTM plus `utm_*` attribution load when configured. `NEXT_PUBLIC_API_BASE_URL` in `.env` stays `https://innowrap.co.in/rodha/`.
- **Profile details endpoint (2026-10-10):** Account mobile/state updates use `PATCH api/auth/me/details`. The dialog still shows only the missing or pencil-edited field, and the request includes only that real value. Empty or omitted keys are left unchanged. The response profile refreshes the session.
- **Courses hero and profile fields (2026-10-10):** Courses listing hero image sits in the container grid, matching the category hero frame. The account dialog asks only for missing mobile and/or state on the auto popup, and a pencil edit sends only that field.

- **Faculty card subjects (2026-10-10):** `FacultyCardV2` lists up to two API subjects and a `+n` remainder. Designation shows only when subjects are missing. Empty experience and bio stay hidden.
- **Listing hero images + toolbar (2026-10-10):** Courses and blog listing heroes use a smaller bottom-aligned image. Course and blog toolbars overlap the hero from `lg` up, and sit below it on tablet and mobile.
- **Header Courses + listing heroes (2026-10-10):** Header and mobile nav include a highlighted Courses link to `/courses`. Free Resources opens the CAT 2027 free course. Courses listing hero uses `courses-hero.png`; blog listing hero uses `Blogs.png`.
- **Account dashboard on the HTTP production host (2026-10-10):** Recommendation Buy controls are native anchors. A Server Component `onClick` on those links failed RSC serialization and the production IP showed Next's "This page couldn't load" page. HTTPS Vercel did not render that handler.
- **Mobile layout, gallery loop, team SVG color (2026-10-10):** Smaller hero and section titles below 640px, wrapping hero CTAs, `h-fit` stat strips, smaller category result cards, carousel `touch-action: pan-x pan-y`, course breadcrumb wrap, course-detail footer clearance, team gallery on `InfiniteMarquee`, team stat SVGs inlined in orange.
- **Localhost images, Buy navigation, course overflow (2026-10-10):** Image optimizer allows `*.s3.ap-south-1.amazonaws.com` and `dangerouslyAllowLocalIP` so NAT64 S3 DNS is not rejected. SVG sources render through `AppImage` instead of `next/image`. Buy uses a same-tab document navigation; checkout redirects use the public origin; cookie `Secure` follows the request scheme. Checkout failures show `checkoutError`. Course detail full-bleed backgrounds no longer use `w-screen`.
- **Rodha Buddy auto-login (2026-10-08):** Header and account Buddy buttons open `/api/buddy/auto-login`, which redirects to `{NEXT_PUBLIC_RODHA_BUDDY_URL}/#/auto-login?authToken=<encoded JWT>` when the login cookie is present. Dev `.env` is `https://rodhabuddy.innowrap.co.in`; `.env.production` is `https://buddy.rodha.co.in`.
- **Account/catalog UX (2026-10-08):** Buy Now uses `isSelfEnrolled` (View Course) on `/courses`, account buy tab, and dashboard recommendations, with the student token on package fetches. Title tooltips on course, recommended, continue-watching, live-class, and order product cells. Orders show payment status and hide Order ID. Category courses no longer fall back to static packages. Blog detail category tags use the header category list. Signup fields marked required with live password strength. Password-update dialog closes on API error. Sidebar support mailto assigns `window.location` so the client router does not swallow it. Test and certificate quick links commented out.
- **Production branch reset + env-separated CI (2026-10-08):** Recreated `production` from current `main` after merging `gitlab/main` (ARM runner, Node 22, ECR, EC2 deploy, non-blocking lint). `main` builds `APP_ENV=development` (`https://innowrap.co.in/rodha/`); `production` builds `APP_ENV=production` (`https://api.rodha.co.in/rodha/`) via `select-env.mjs`.
- **Env files per environment (2026-10-08):** Committed `.env` (`https://innowrap.co.in/rodha/`) and `.env.production` (`https://api.rodha.co.in/rodha/`). `select-env.mjs` plus Docker `APP_ENV` and GitLab jobs pick one file before `next build` so Next cannot load both. SMTP passwords stay in `.env.local`.
- **Google login production harden (2026-10-07):** GIS overlay uses near-invisible opacity (not `opacity-0`), `Script` `onReady`, origin-aware `error_callback`, and `next.config` build-time passthrough for `NEXT_PUBLIC_GOOGLE_CLIENT_ID` / `NEXT_PUBLIC_API_BASE_URL`. Documented Vercel + rodha.co.in Authorized JavaScript origins; production API URL `https://api.rodha.co.in/rodha/`.
- **Quick Content filters/shimmer + UX polish (2026-10-07):** `/account/content` course + package filters from filter-options; shimmer skeletons on content + course-detail listing loads; DropdownSelect menu `z-[110]` above ConfirmDialog; counselling modal auto-closes 2s after success; Continue Watching CTA label `View`.
- **Live content + Quick Actions + account UX (2026-10-07):** Background `POST enrollments/refresh` via BFF + `useEnrollmentRefresh` (4 min). Orders product image fallback + Payment column removed. Continue Watching cards show Time Spent / Valid Till / Language (no thumbnail time / ⋮ menu). Category hero Enrol for Free → login → `/courses?categoryId=`. FAQ pagination scrolls to `#faq-list`. Google login overlay hit-target fixed. Continue/Buy Reset Filters clears search+filters. `todayContents` Live Classes on dashboard + continue tab; Quick Action tiles → `/account/content` (mandatory `type`, server pagination, no infinite scroll). Course detail: detail/progress/`productContents` independent of Quick Actions listing (`type` default `videos`, includes `assignments`). Header search → Quick Content with clear button.
- **Vercel standalone fix + client course detail (2026-10-07):** Disable `output: "standalone"` when `VERCEL` is set (fixes ENOENT `next-server.js.nft.json`). Account course detail loads via client + BFF (`/api/account/courses/:id` + chapters) for easier API debugging; SSO still via `/api/graphy/sso`.
- **Account Graphy course learning UX (2026-10-07):** `/account/courses/[courseId]` is a Rodha-native single-page hub — progress, content-type tabs (Videos/Live/PDFs/Quizzes; chapters as filters only), search + Postman filters (completion/live/result/chapter), paginated content cards opening Graphy via `takeUrl` + SSO. Continue Watching and Buy Courses get account-styled search/filters with mobile bottom sheets. Student courses types/mapper/service extended for chapters, filter-options, and enrollment progress.
- **Catalog toolbar mobile filters + dropdown layering (2026-10-07):** `DropdownSelect` menus portal to `document.body` so toolbar transforms/stacking no longer bury options under sibling filters or course cards. Mobile `/courses` (+ legacy test-series) use a Filter icon + `BottomSheet` for dropdown filters; search and draggable subcategory/category tiles stay outside the sheet. Packages Type (`graphyCategory`) filter UI temporarily disabled (URL/API wiring kept).
- **Category embedded packages + courses filters (2026-10-07):** Category landing courses use `packages.items` / `packages.groups` from category detail (no separate packages API). View all → `/courses?categoryId=`. Courses listing filters from masters: categories dropdown, Type (`graphyCategory`), subCategory1 tabs, faculty, subject, sort (`sortBy`/`sortOrder`); skip tag/language. Forgot-password payload already includes `is_web: true`.
- **Course card UX + password reset (2026-10-07):** Carousel drag no longer blocks card clicks; category/listing cards go to `/courses/[slug]` while Buy Now uses checkout (CTA stopPropagation). Catalog toolbar gets higher z-index, non-shrinking search, and draggable category tabs. Added `/forgot-password` + `/reset-password` on the auth layout with BFF routes to Graphy forgot/reset APIs.
- **Package detail + category courses (2026-10-07):** `GET api/website/packages/:slug` mapper aligned to Postman (`fullName`/`profileImageUrl` faculty, `batchStarts` array, testimonials, derived `discountPercent`). Course detail hides Plans and empty API sections (`fillMissing: false`). Category course cards are full-card links to `/courses/[slug]`; subcategory filter tabs probe for packages and hide empty types. `CourseCard` / `CourseCardV2` show API-derived discount %.
- **GitLab production workflow (2026-10-06):** `main` = development, `production` = production. `.gitlab-ci.yml` with environment-scoped builds + Docker (`Dockerfile`, compose); registry tags `development-*` / `production-*`; docs in `docs/DEPLOYMENT_GITLAB.md`. Manual PM2 or Docker deploy.
- **CI fix (2026-10-08):** jobs tagged `arm` (ARM64 shell runner with Docker; Node runs via `docker run node:20-alpine`, fixing `node: command not found`). Images pushed to ECR (`ECR_IMAGE` in `.gitlab-ci.yml`); pipeline is `validate` + one `build` job (Dockerfile → ECR); compose deploy removed (compose is local dev only); `deploy` job SSHes to EC2 (`EC2_HOST`/`EC2_USER`/`EC2_PORT`/`PEM_FILE`) and restarts the container from ECR.
- **State selection (2026-10-06):** `states` module + BFF dropdown; signup requires `stateId`; `GET api/auth/me` + `PATCH api/auth/me/state` wired; Jotai `userAtom` in account shell; blocking Update State dialog when `state` is null; Profile Update State + Checkout pay blocked until state set.
- **UI / integration fixes (2026-10-06):** Account header session user + Buddy / Take Test / Live Classroom; shared `COURSE_IMAGE_FALLBACK`; 401/403 → session-expired BFF + login toast (`sonner`); profile avatar crop/upload + email/phone-only details + password/logout confirm; `/` → `NEXT_PUBLIC_DEFAULT_HOME_PATH`; Footer Category from CMS `categoriesAtom`; category filter tab drag-scroll; checkout coupon outside summary + success Lottie/Meta Pixel; Download Invoice; Settings hidden; category hero WhatsApp/Brochure icon CTAs.
- **Graphy packages + student commerce (2026-10-05):** Public `/courses` + category courses use `GET /website/packages` with Category=`graphyCategory` and Course Type=`subCategory1` masters. Package detail at `/courses/[slug]` (Plan hidden). Buy Now → login → clear cart → add package → `/account/checkout` + Razorpay verify. Auth persists Graphy SSO; Header Login/Dashboard; account Open Graphy new tab. Dashboard/Continue Watching/course detail/orders/profile wired to student APIs. Test Series + My Cart nav hidden. Gaps in `docs/graphy-api-requirements.txt`.
- **Banner empty-state / hide heroes (2026-09-29):** Home, category, about, team, and faculty heroes no longer fall back to static placeholder copy/images/stats for empty CMS banner fields. If the banner is missing/inactive, the hero section is hidden. Category mapper sets `hero: null` and empty `quickStats` when no banner; `withCategoryLandingDefaults` preserves that null.
- **Home/blog UI + mapping fixes (2026-09-29):** Hero stacks pass through CMS `iconUrl` and render icons. Category + results descriptions use `ClampTooltip` (`line-clamp-5` / `line-clamp-2`). Results mapper reads `result.description`; category CTA is a real `Link` (no nested button) with carousel pointer stop. Blog detail prose gets Privacy-style overflow wrapping (`break-words` / `overflow-wrap: anywhere`).
- **Website `(website)` layout split (2026-09-29):** Root layout is fonts/globals/metadata/JSON-LD only. Public SiteFrame + `WebsiteStoreProvider` moved to `src/app/(website)/layout.tsx`. All public pages (home, marketing, auth) live under `(website)` with unchanged URLs. `/account/*` no longer passes through SiteFrame. `CatalogToolbar` imports updated to `@/app/(website)/courses/CatalogToolbar`.
- **Account module integration + responsive polish (2026-09-29):** Conflict check across `src/app/account/`, `src/components/account/`, `src/data/account/`, `src/lib/account/` — `tsc --noEmit` clean. Mobile header search expands as an overlay (was `sr-only`/unusable). `AccountPagination` picks light/dark from account theme. Orders table scrolls inside the card (no page overflow); dashboard/cart grids stack. Knowledge docs updated for the full module.
- **Account My Cart page (2026-09-29):** Full `/account/cart` — item cards (image, type badge, meta, prices, View Details, remove), sticky Order Summary with computed subtotal / MRP discount / GST 18% / total + RODHA10 coupon apply/remove, Continue to Pay (UI only), savings banner, You May Also Like rail from `ACCOUNT_RECOMMENDED_PRODUCTS`. Helpers in `src/lib/account/cart-totals.ts`.
- **Account orders / profile / settings (2026-09-29):** `/account/orders` desktop table + mobile cards (Order ID, product, date, amount, payment status, order status, View). `/account/profile` avatar, Edit Profile, update-name + change-password with client validation/success (no APIs). `/account/settings` polished stub. Extended `AccountOrder` with `paymentStatus`; added `AccountOrdersList` + `AccountProfilePanel`.
- **Account Dashboard page (2026-09-29):** Full `/account/dashboard` matching light/dark refs — welcome banner (orange first name + MBA 3D illustration), Continue Watching + Recommended grids (`AccountContinueWatchingCard` / `AccountRecommendedCard` `showCta={false}`), right rail Learning Progress ring, My Orders preview, Quick Links. View All → courses tabs. Account theme CSS vars extended for welcome/status/progress. Responsive two-column → stack.
- **Account Courses + Test Series (2026-09-29):** `/account/courses` tabs Continue Watching | Buy Courses (`?tab=continue|buy`, aliases `continue-watching` / `buy-courses`); default continue. Continue cards via `AccountContinueWatchingCard` + URL `AccountPagination` (6/page). Buy uses `CourseCardV2` with optional `ctaLabel="Buy Now"`. `/account/test-series` grids `TestSeriesCardV2` + pagination from static account data. Sidebar deep-links highlight correct tab.
- **Account dashboard static data (2026-09-29):** Typed models in `src/lib/account/types.ts` plus `src/data/account/*` (`user`, `dashboard`, `continue-watching`, `courses`, `test-series`, `orders`, `cart`, `recommended`, `profile`). Rodha-style CAT/MBA sample data for Jitendra Saini; ~8–12 items per list for pagination.
- **Account dashboard shell + scoped theme (2026-09-29):** `/account/*` nested layout with `AccountShell` / `AccountSidebar` / `AccountHeader` / `AccountThemeProvider`. Outside public `(website)` layout (no SiteFrame). Light/dark via `data-account-theme` + account CSS (no `html.dark` toggle); circular View Transition from click (viewport center for keyboard); `localStorage` persistence. Sidebar nav + cart badge, Need Help card, mobile drawer. Header search + Ctrl+K, theme toggle, notifications dot, Live Dashboard, profile dropdown Logout via `POST /api/auth/logout` + `clearAuthCookie`.
- **Auth UI + API path polish (2026-09-28):** Login/signup left column is a full-bleed two-slide panel (`login-banner.png` per slide) with the original `rodha-logo.webp`. Desktop auth is viewport-locked (`h-dvh overflow-hidden`); only the form column scrolls. Light inputs use `!bg-white` so they beat `.input-base` on `html.dark`. Student auth now posts to `NEXT_PUBLIC_API_BASE_URL` + `api/auth/user/{signup,login,google}`.
- **Faculty detail 404 (2026-09-28):** `GET api/website/faculty/:slug` now returns `{ faculty, packages }` instead of a flat profile. `mapFacultyDetail` unwraps `data.faculty` and maps courses from `packages.items` (legacy flat `courses` still accepted). Every slug was 404ing because the mapper treated the wrapper as a missing profile.
- **Login `/login` + Signup `/signup` (2026-09-28):** Split-panel auth matching the signup mockup. Password signup/login via `api/auth/user/signup` and `api/auth/user/login` (`is_web: true`) on `NEXT_PUBLIC_API_BASE_URL`. Google Identity Services ID token → `api/auth/user/google` (not in Postman). httpOnly `rodha_access_token` cookie; redirect to stub `/account/dashboard`. Marketing chrome hidden on auth routes via `SiteFrame`. No Apple login; Header destinations unchanged.
- **Courses `/courses` + Test Series `/test-series` listings (2026-09-28):** Blog-style dark hero (`ListingHeroSection` + `banner.png`), overlapping URL toolbar (CMS category chips, search, course-type + paid/free icon dropdowns), `CourseCardV2` / `TestSeriesCardV2` grids at 10 per page, then shared `SuccessStoriesSection` and `CTABandV2Decorative`. Catalog is SSR-aggregated from active category pages (CMS + existing static fallback). Header/Footer destinations unchanged.
- **Category faculty/stories marquee alignment (2026-09-18):** `InfiniteMarquee` accepts optional `align="center"` for non-overflowing lists. Category faculty and success stories use it so a short row sits under the centered headers; results, testimonials, team, and other marquees keep the default start alignment.
- **New-category landing fallback (2026-09-18):** Categories that exist in the CMS but not in `category-landings.json` now get a name-based chrome template (`src/data/category-landing-defaults.ts`). Section titles, subtitles, hero copy, CTA, colors, and mixed-theme surfaces fill automatically from the API category name. List sections still hide when empty; result-stat panels and hero media columns no longer render blank.
- **Listing/form polish (2026-09-17):** `InfiniteMarquee` stays left-aligned without clones when items fit. Category results use a second marquee only at 15+ cards; testimonials stay a single horizontal row below 6 items. Blog listing shows `isFeatured` on the unfiltered view and detail pages render `relatedBlogs`. Faculty search/filter keeps the viewport on `#faculty-list`. Lead/contact/counselling forms validate required fields, 10-digit phones, and alphabetic names. Category courses/test series fall back to static catalog cards while CMS lists are empty.
- **CMS page APIs (2026-09-16):** Category detail, faculty listing/detail, about, team, legal HTML pages, and contact POST wired SSR-first. Category faculty cards come from the same category-page payload as testimonials, success stories, and FAQs. Category and faculty course lists map `courseType` into the existing static slider chips. Empty sections hidden. Contact / counselling / lead-capture POST via `/api/leads` → CMS `api/website/contact` (API key server-side); newsletter stays SMTP.
- Design system in `src/app/globals.css` (tokens, utilities, buttons, cards, inputs)
- Layout shell: `PromotionalBanner`, `Header`, `Footer`, `MobileNav`, `Container`
- **Website CMS API layer (2026-09-15):** `src/lib/api/` client + announcements / categories / home modules; SSR fetch in root layout + `/`; announcement 3D flip; header/mobile categories from API; homepage hero/categories/FAQs/results from Get Home; empty sections hidden; agent skill `.cursor/skills/api-integration/`
- **Header nav trim (2026-07-17):** `HEADER_NAV` limited to About Us, Faculty, Blogs, Contact Us (desktop + mobile)
- Homepage (`src/app/page.tsx`) — all major sections wired
- Project knowledge base + Cursor rules
- **FAQ listing (`/faq`) (2026-07-14):** search, category filter pills, accordion, pagination; data in `src/data/faq.ts`
- **Legal pages (2026-07-14):** Privacy, Terms, Refund, Disclaimer via shared `LegalPageLayout` + `src/data/legal.ts`
- **Meet the Team `/team` (2026-07-16):** Full page — hero, leadership, faculty experts, advisors, culture, CTA
- **Faculty listing `/faculty` + detail `/faculty/[slug]` (2026-07-20/21)**
- **Homepage v2 redesign + gradient/canvas polish (2026-07-24)** — live at `/`; legacy frozen at `/legacy-homepage`
- **Counselling modal dialog (2026-07-24):** Global provider + site-wide counselling CTAs
- **MBA homepage-theme alignment + `/cat` route (2026-08-13/14):** CAT V2 mixed-theme; internal id `mba` vs slug `cat`
- **Theme + dynamic category rollout (2026-08-16):**
  - Canonical category URLs: `/category/[category_slug]` (+ nested courses); one JSON SoT (`category-landings.json`) + `CategoryLandingPage` CAT V2 template for all five verticals
  - Permanent redirects: `/cat|ipmat|clat|banking|skillhouse` (+ nested), `/mba`, `/gdpi` → `/category/...` (no chains)
  - Scoped mixed-theme tokens (`section-white/beige/cream`, `brand-orange`) + `docs/style.md`; homepage `/` and `/legacy-homepage` composition preserved
  - Live non-reference pages restyled with white/beige/dark alternation (About, Contact, Blog, FAQ, Team, Faculty listing/detail, Legal)
  - Path helpers, Header/MobileNav active slug under `/category/...`, Footer/nav/CTA/link surfaces updated
- **CAT category content refresh (2026-08-17):**
  - Updated CAT hero headline, three rotating conversion outcomes, and data-driven selection/aspirant stats
  - Added 40 CAT 2025 student results and 27 curated testimonials; downloaded, validated, and optimized 46 supplied Drive portraits (text-only entries retain the placeholder)
  - Added four supplied CAT mock-package card images and limited CAT faculty to the nine supplied faculty profiles
  - Replaced the CAT course catalog with six current Rodha offerings and exact external course URLs; category course sections use a responsive slider with four desktop cards, arrow controls, mouse dragging, and touch swiping
  - Removed unused legacy category JSON fields (`sectionOrder`, `heroFeatures`, `resources`, `featuredCourseIds`, and unused hero/story fields)
- **About Us `/about` + Contact Us `/contact` (2026-08-17):**
  - About: dark hero, mission/vision, journey timeline, differentiators, impact stats, CAT `FacultyCardV2` carousel, featured testimonials, light counselling CTA
  - Contact: dark form hero (counselling +91 phone chrome), channel strip, office map, support hours, FAQ accordion, Rodha Buddy CTA
  - Page-specific contact details in `src/data/contact.ts` so Footer `CONTACT_INFO` stays unchanged
- **Blog listing `/blog` + detail `/blog/[slug]` (2026-08-19):**
  - Listing: light hero with breadcrumb/eyebrow/heading, URL-driven category filters + search, featured post (article variant), latest posts grid (4-col), pagination, CTABandV2Decorative. No newsletter.
  - Detail: breadcrumb, category badge link, title, description, date/readTime, hero image, HTML blog body with `.blog-prose` styles, sticky sidebar with reusable `BlogCategories` + `ShareBlog` (copy, WhatsApp, Facebook, X, LinkedIn), related posts grid, CTABandV2Decorative.
  - 16 blog posts across 7 categories with HTML content in `src/data/blog.ts`; `BlogPost` type updated (backward compat for legacy homepage overlay cards).
  - `BlogCard` article variant (white card, category link badge, calendar/clock meta); overlay variant preserved for legacy homepage.
  - `Pagination` supports URL-based navigation (`basePath` + `query`) and `variant="light"` for light backgrounds.
  - `blogPostingJsonLd` added to `structured-data.ts`; detail pages have full OG/Twitter/canonical meta + BreadcrumbList + BlogPosting JSON-LD.
  - No author UI, no "On This Page", no newsletter section.
- **Theme alignment pass (2026-08-19):**
  - `SearchInput` now has `variant?: "dark" | "light"` with stronger `pl-11` icon clearance
  - `DropdownSelect` light menu (white bg, dark text, orange hover) when `variant="light"`
  - `Input` / `Textarea` prefix padding increased to `pl-11`
  - `BlogCard` article variant: unified orange badge, orange-tinted shadow, orange meta icons
  - Faculty listing + featured: `FacultyCardV2` replaces `FacultyListingCard`; light filters/dropdowns/pagination/reset
  - Team: breadcrumb moved into dark hero; `LeadershipCard` vertical light; `FacultyCardV2` for experts; Advisors title black
  - About: quote card repositioned into hero image plane (bottom-right); Mission/Vision icon enlarged + black bg removed; timeline connector bounded/visible; differentiators title aligned; 3D impact icons for all stats; testimonial shorter
  - Contact: dark compact form (Name|Phone row); breadcrumb in left column; overlapping unified info strip; office/map unified card; support hours simplified + holidays line; Why Contact star header
  - Blog listing: dark hero; `SectionHeaderV2` for Featured/Latest; both sections white
  - Blog detail: white article body; beige sidebar cards; `SectionHeaderV2` for Related; orange badges/icons
- **Faculty detail `/faculty/[slug]` light mixed-theme (2026-08-20):**
  - Dark 2-column hero (portrait + copy/stats); breadcrumb in hero; decorative third column removed
  - Body: white/beige alternating sections with light cards (`border-section-beige`, white surfaces)
  - Three-column About / Teaching Philosophy / Subject Expertise; `SectionHeaderV2` on courses + results
  - `withFacultyDetailDefaults()` + `getFacultyHonorific()` — every faculty slug gets full section data from JSON defaults
  - `react-icons` via `src/lib/faculty-icons.tsx`; `CTABandV2Decorative` optional `tertiaryAction` (Rodha Buddy on detail)
- **Category course catalog + filter chips (2026-08-20):**
  - Light filter chips above the existing category course slider: All (default), Comprehensive, Individual, Crash Course
  - Slider and `CourseCardV2` layout unchanged; cards now tolerate FREE pricing and missing included-course counts
  - Replaced CAT / IPMAT / CLAT / SSC / Skill House course JSON from the latest sheet (titles, copy, prices, CTAs)
  - Downloaded named thumbnails into `public/assets/images/courses/{cat,ipmat,clat,ssc,skillhouse}/`
  - CAT mock packages included in the CAT All list; CAT test-series cards now point at the live ThinkExam package URLs
- **Faculty / Team / Category content cleanup (2026-08-20):**
  - Removed all dummy faculty; kept 18 real profiles (12 enriched from `Rodha Faculty.docx` + 6 portrait-only)
  - Faculty detail: publications removed; achievements full-width; reviews from category testimonials (max 3, relevance-matched); YouTube snippets open in `StoriesModal`; courses from landing `faculty` strings via `CategoryCoursesSlider`
  - Faculty listing: Average Rating hero stat removed; Featured uses `InfiniteMarquee`; Experience filter replaced with Category + derived Subject filters
  - Team: Faculty Experts + Advisors commented out; new `LovedTeamSection` full-width image carousel (3s autoplay)
  - Course filter chips are data-driven; filter bar hidden when only one `courseType` exists
  - Category testimonials: initials for missing photos; blurred-bg + `object-contain` for real photos
- **SMTP lead forms (2026-08-20):**
  - `POST /api/leads` + Nodemailer SMTP (Gmail) emails all Contact / Counselling / LeadCapture / Newsletter submissions to `support@rodha.co.in`
  - Light Rodha HTML template; logo absolute URL `https://rodha.co.in/assets/images/rodha-logo-orange.svg` (from `NEXT_PUBLIC_BASE_URL`, never request Host)
- **Content & SEO migration (2026-08-20):**
  - Featured faculty ordered list of 13 (Team + Faculty marquees); Himanshu renamed to Himanshu Kushwaha; 5 others remain in All Faculty only
  - Replaced 16 dummy blogs with 9 migrated articles from rodha.co.in (full HTML, tables, local images under `public/assets/images/blog/{slug}/`); categories All/MBA/IPMAT/SSC
  - Legal pages rewritten from live Privacy / Terms / Refund; Disclaimer rebuilt from Terms §11 + Rodha product facts (**legal review flagged**)
  - FAQ listing rebuilt from Home + 5 vertical FAQs; filters All/General/CAT/IPMAT/SSC/CLAT/Skill House (42 items after dedupe)
  - SEO: `metadataBase`, default OG `og-rodha.png`, favicon/apple icons, `buildPageMetadata` canonicals, `webSiteJsonLd`, BlogPosting author/dateModified, homepage FAQ JSON-LD; Contact FAQ JSON-LD removed (UI hidden)
  - Redirects: `/privacypolicy`, `/termsofuse`, `/refundpolicy` → new routes
- **Hero videos + faculty doc refresh (2026-08-20):**
  - Homepage + five category heroes now pass distinct YouTube ids into existing `HeroVideoEmbed` (`hero.videoId` on category landings)
  - All 18 faculty profiles enriched from `Rodha Faculty (1).docx` (remaining six: Himanshu, Divya Kumar Garg, Kriti Bhatnagar, Rupal Choudhary, Ananya Singhal, Abhishek Dubey)
  - Faculty detail courses resolve via authored `courseGraphyIds` matched to existing category-landing cards only (skip CAT R1 comprehensive + COMPLETE OMETS 2026 — no cards); Tarun has empty list (no usable links)
  - Category `facultyIds` realigned (CLAT / SSC / Skill House); Skill House carousel shows Divya only
- **IPMAT results + homepage results trim (2026-08-20):**
  - Added 16 IPMAT 2026 student results with downloaded Drive portraits; CAT keeps its 35 cards
  - Homepage results carousel is CAT + IPMAT only (GDPI/CLAT slides removed), max 10 cards each
  - IPMAT cards show AIR rank when present, otherwise an Achiever/Topper placeholder
  - Results section now renders only on CAT and IPMAT landings; CLAT / SSC / Skill House results arrays cleared
  - Rodha App copy + live Play/App Store URLs for Rodha App and Rodha Buddy
- **Header/footer nav destinations (2026-08-20):**
  - Removed header login/account control and mobile Login / Sign Up
  - Removed footer Success Stories; Free Resources now follows the same category-aware URL as the header
  - Header Test Series points at `https://mocks.rodha.co.in/`; Free Resources uses CAT on home/other pages, IPMAT/CLAT/SSC-specific Graphy courses on those landings, and the CAT free course on CAT + Skill House
- **Course detail `/courses/[slug]` (2026-08-21):**
  - Data-driven template from `category-landings.json` via `course-details.ts` defaults (modules, included, schedule, single pricing plan, faculty parse, related, FAQs, testimonials)
  - Dark hero + sticky purchase card (Buy Now → Graphy, Talk to Rodha Buddy); details/curriculum; faculty detail cards; included + schedule; pricing; light `TestimonialCardV2` carousel; related `CourseCardV2`; `AccordionV2` FAQs; Enquire Now `LeadCaptureForm` (+ exam year) with mobile sticky bar
  - Permanent redirect `/category/:category_slug/courses/:slug` → `/courses/:slug`; nested placeholder page removed
  - Homepage and category landings unchanged
- **Course detail UI polish (2026-08-21):**
  - Compact sticky purchase card (image/title/price/Buy Now; viewport-fit; sticky through testimonials until Related)
  - Enquire Now opens shared counselling modal in enquiry mode (Exam/Name/Mobile/Email/Exam Year); removed sidebar enquiry card
  - Related courses match category slider + 3s autoplay; faculty horizontal carousel; testimonials InfiniteMarquee; info cards 4-col desktop

---

## In Progress / Partial

| Item | Status | Notes |
|------|--------|-------|
| Homepage vs approved PNG | Partial | Premium polish shipped; app store URLs now live on the app promo cards |
| Header category-state nav | Partial | Exam switcher syncs under `/category/[slug]`; full category-state nav links still TBD |
| Category hero photography | Partial | Non-MBA landings still share CAT hero photo until dedicated assets arrive |
| Course detail content depth | Partial | Template complete with derived defaults; optional per-course modules/pricingPlans/facultyIds can be authored in JSON later |

---

## Remaining Tasks

### Assets still needed
- [ ] Transparent faculty / student PNGs
- [ ] Dedicated IPMAT / Law / Banking / Skill House hero images
- [ ] Dedicated leadership / advisor headshots (interim: homepage `profiles/`)
- [x] App promotion store URLs (Rodha App + Rodha Buddy Play/App Store links live)
- [ ] Dynamic faculty result stats (section hidden until the faculty API provides result stats)

### Screens
- [x] About `/about`
- [x] Blog listing `/blog` + detail `/blog/[slug]`
- [x] Course listing `/courses`
- [x] Test series listing `/test-series`
- [x] Course detail `/courses/[slug]`
- [x] Contact `/contact`
- [x] Faculty listing `/faculty`
- [x] Faculty detail `/faculty/[slug]`
- [x] Meet the Team `/team`
- [x] FAQ listing (`/faq`)
- [x] Legal pages (Privacy / Terms / Refund / Disclaimer)
- [x] Dynamic category landings `/category/[category_slug]`
- [x] Login `/login` + Signup `/signup`
- [x] Student account pages (`/account/*`) — dashboard, courses, test-series, cart, orders, profile, settings
- [x] Promo dialog (`api/website/promotional-banner`)

### Integrations
- [x] Homepage + layout CMS APIs (announcements, categories, Get Home) — SSR-first
- [x] Category page + faculty + about + team + legal + contact POST (SSR-first; category faculty in the same payload as testimonials/stories/FAQs; `courseType` on category/faculty courses)
- [ ] FAQ listing API, blogs
- [x] Modular sitemap.xml + robots.txt + HTML `/sitemap`
- [ ] Final external URLs

---

## Blockers

| Item | Owner | Impact |
|------|-------|--------|
| Transparent faculty / student PNGs | Client | Course/Faculty/Results cutout look |
| Graphy / ThinkExam / Buddy URLs | Client | CTA targets |
| Category-specific hero photos | Client | Unique hero visuals per exam |

---

## Technical Debt

- Form stubs still TODO
- Some toppers reuse portrait files
- Non-MBA landings share CAT hero photo until dedicated assets arrive
- Faculty detail body cards still use dark `card-base` islands on light section shells (intentional mixed theme)
- Course detail curriculum/pricing are defaults until per-course JSON overrides are authored
- Account module: Continue to Pay / notifications / Settings preferences / cart badge live sync / profile APIs still out of scope (static demo only)
- Account search is presentational (Ctrl+K focuses input; no results)
