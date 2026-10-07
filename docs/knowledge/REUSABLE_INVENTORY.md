# Reusable Inventory

**Search this file and the codebase before creating anything new.**  
**Last updated:** 2026-10-07 (Account course learning hub)

After adding a reusable component, hook, util, type, or asset, update this inventory.

---

## UI — `src/components/ui/`

| Component | File |
|-----------|------|
| Accordion | `Accordion.tsx` |
| AccentUnderline | `AccentUnderline.tsx` |
| AmbientBackground | `AmbientBackground.tsx` |
| Badge | `Badge.tsx` |
| Breadcrumb | `Breadcrumb.tsx` |
| Button | `Button.tsx` |
| Carousel | `Carousel.tsx` (arrow controls, responsive item sizing support, mouse drag, and native touch swipe) |
| ClampTooltip | `ClampTooltip.tsx` (line-clamp + viewport-aware full-text tooltip when truncated) |
| CountdownTimer | `CountdownTimer.tsx` |
| Divider | `Divider.tsx` |
| DropdownSelect | `DropdownSelect.tsx` (optional `variant?: "dark" \| "light"`, `prefixIcon`, `error`; menu portaled to `document.body`) |
| BottomSheet | `BottomSheet.tsx` (mobile slide-up panel; portaled; body scroll lock) |
| Input | `Input.tsx` (optional `variant?: "dark" \| "light"`; default dark) |
| CounsellingCtaButton | `CounsellingCtaButton.tsx` |
| Modal | `Modal.tsx` |
| Pagination | `Pagination.tsx` (optional `basePath`+`query` for URL-based navigation; `variant?: "dark" \| "light"`) |
| Rating | `Rating.tsx` |
| RevealGroup | `RevealGroup.tsx` |
| SearchInput | `SearchInput.tsx` (optional `variant?: "dark" \| "light"`; default dark) |
| Select | `Select.tsx` |
| Skeleton | `Skeleton.tsx` |
| Tag | `Tag.tsx` (optional `variant?: "dark" \| "light"`; light matches blog filter pills) |
| Textarea | `Textarea.tsx` (optional `variant?: "dark" \| "light"` and `prefixIcon`; default dark) |
| InfiniteMarquee | `infiniteMarquee.tsx` (loops only when items overflow; otherwise `align` start/center, default start, no clones) |

## Layout — `src/components/layout/`

| Component | File |
|-----------|------|
| Container | `Container.tsx` |
| Footer | `Footer.tsx` (no Success Stories; Free Resources is category-aware) |
| CounsellingModalProvider | `CounsellingModalProvider.tsx` |
| FloatingCounsellingCta | `FloatingCounsellingCta.tsx` |
| Header | `Header.tsx` (no login control; Test Series → mocks.rodha.co.in; Free Resources by vertical) |
| MobileNav | `MobileNav.tsx` (mirrors header destinations; no Login / Sign Up) |
| PromotionalBanner | `PromotionalBanner.tsx` (API announcements; 3D flip; countdown when `endAt`) |
| SiteFrame | `SiteFrame.tsx` (public `(website)` layout only; hides marketing chrome on `/login` and `/signup`) |
| StoriesModal | `VideoModal.tsx` (YouTube iframe modal for `YoutubeStoryCard` clicks) |

## Sections — `src/components/sections/`

| Component | File |
|-----------|------|
| CategoryHeroSection | `CategoryHeroSection.tsx` |
| CategoryLandingPage | `CategoryLandingPage.tsx` (CMS category page + JSON copy/themes; faculty from same payload as testimonials/FAQs; stories via `SuccessStoriesSection`) |
| SuccessStoriesSection | `SuccessStoriesSection.tsx` (“Watch how they Did it.” marquee + `YoutubeStoryCard`; hide when empty) |
| ListingHeroSection | `listing/ListingHeroSection.tsx` (dark listing hero: breadcrumb, eyebrow, title/accent, subtitle, right-side art) |
| CategoryCoursesSlider | `CategoryCoursesSlider.tsx` (client island: data-driven courseType chips — hide bar when ≤1 type; existing course carousel) |
| LovedTeamSection | `LovedTeamSection.tsx` (full-width image-only carousel; autoplay 3s; team CTA assets) |
| CounsellingCtaAction | `CounsellingCtaAction.tsx` |
| CTABand | `CTABand.tsx` (optional `backgroundImage`, `titleAccent`, `secondaryOutline` for home variant; counselling `/contact` actions open modal) |
| CTABandV2 | `CTABandV2.tsx` (locked homepage full-bleed image CTA) |
| CTABandV2Decorative | `CTABandV2Decorative.tsx` (MBA image-left / content-right decorative variant; optional `tertiaryAction` e.g. Rodha Buddy; homepage unchanged) |
| CultureSection | `CultureSection.tsx` |
| AdvisorsSection | `AdvisorsSection.tsx` |
| FacultyFiltersBar | `FacultyFiltersBar.tsx` |
| FacultyHeroSection | `FacultyHeroSection.tsx` |
| FacultyDetailHeroSection | `FacultyDetailHeroSection.tsx` (dark 2-col hero + breadcrumb + stat cards) |
| FacultyInfoCardsSection | `FacultyInfoCardsSection.tsx` (3 light cards: About / Philosophy / Expertise) |
| FacultyCoursesSection | `FacultyCoursesSection.tsx` |
| FacultyAchievementsPublicationsSection | `FacultyAchievementsPublicationsSection.tsx` |
| FacultyReviewsVideosSection | `FacultyReviewsVideosSection.tsx` |
| FacultyResultsSection | `FacultyResultsSection.tsx` |
| FeaturedFacultySection | `FeaturedFacultySection.tsx` |
| FacultyWhySection | `FacultyWhySection.tsx` |
| HeroSection | `HeroSection.tsx` |
| HomeHeroShell | `home/HomeHeroShell.tsx` |
| HomePageBackground | `home/HomePageBackground.tsx` |
| HomePageBodyTheme | `home/HomePageBodyTheme.tsx` |
| HomeHeroSection | `home/HomeHeroSection.tsx` |
| HeroCounsellingForm | `home/HeroCounsellingForm.tsx` |
| HeroNeuralCanvas | `home/HeroNeuralCanvas.tsx` |
| HeroVideoEmbed | `home/HeroVideoEmbed.tsx` |
| HeroFloatingStats | `home/HeroFloatingStats.tsx` |
| HeroTrustMetrics | `home/HeroTrustMetrics.tsx` |
| HomeCategoriesSection | `home/HomeCategoriesSection.tsx` |
| HomeImpactSection | `home/HomeImpactSection.tsx` |
| ImpactGrowthTimeline | `home/ImpactGrowthTimeline.tsx` |
| ImpactGrowthBadge | `home/ImpactGrowthBadge.tsx` |
| ImpactTimelineAxisItem | `home/ImpactTimelineAxisItem.tsx` |
| ImpactStatBadge | `home/ImpactStatBadge.tsx` |
| ImpactStatsRow | `home/ImpactStatsRow.tsx` |
| HomeResultsSection | `home/HomeResultsSection.tsx` |
| HomeAppPromotionSection | `home/HomeAppPromotionSection.tsx` (Rodha Buddy + Rodha App cards; live Play Store / App Store URLs; optional eyebrow/title/description/className/mockupSrc) |
| LegalPageLayout | `LegalPageLayout.tsx` (CMS HTML + heading TOC) |
| LegalCmsPage | `LegalCmsPage.tsx` (shared legal route fetch + metadata) |
| LegalCmsPage | `LegalCmsPage.tsx` (shared legal route fetch + metadata) |
| ResultsStatsPanel | `ResultsStatsPanel.tsx` (optional `variant?: "dark" \| "light"`; default dark for other categories) |
| SectionHeader | `SectionHeader.tsx` |
| SectionHeaderV2 | `SectionHeaderV2.tsx` (locked homepage / MBA light headers) |
| TeamHeroSection | `TeamHeroSection.tsx` |
| TrustBar | `TrustBar.tsx` |
| AboutHeroSection | `about/AboutHeroSection.tsx` |
| AboutMissionVisionSection | `about/AboutMissionVisionSection.tsx` |
| AboutJourneyTimeline | `about/AboutJourneyTimeline.tsx` (horizontal on `md+`, vertical on mobile) |
| AboutDifferentiatorsSection | `about/AboutDifferentiatorsSection.tsx` |
| AboutImpactSection | `about/AboutImpactSection.tsx` |
| AboutMentorsSection | `about/AboutMentorsSection.tsx` (`FacultyCardV2` + `Carousel`; CAT faculty) |
| AboutTestimonialSection | `about/AboutTestimonialSection.tsx` |
| AboutFinalCtaSection | `about/AboutFinalCtaSection.tsx` |
| ContactHeroSection | `contact/ContactHeroSection.tsx` |
| ContactInfoStrip | `contact/ContactInfoStrip.tsx` |
| ContactOfficeSupportSection | `contact/ContactOfficeSupportSection.tsx` (Google Maps iframe) |
| ContactCtaSection | `contact/ContactCtaSection.tsx` |
| ContactFaqSection | `contact/ContactFaqSection.tsx` (`AccordionV2`) |
| ContactBuddyCtaSection | `contact/ContactBuddyCtaSection.tsx` |
| BlogHeroSection | `blog/BlogHeroSection.tsx` (light hero with breadcrumb, eyebrow, heading, hero-blog image) |
| BlogCategories | `blog/BlogCategories.tsx` (category badge links to `/blog?category=…`; optional `activeCategory`) |
| ShareBlog | `blog/ShareBlog.tsx` (client; Copy Link, WhatsApp, Facebook, X, LinkedIn share buttons; `url`+`title` props) |
| CourseDetailPageView | `course/CourseDetailPage.tsx` (assembler for `/courses/[slug]`) |
| CourseHeroSection | `course/CourseHeroSection.tsx` |
| CourseDetailsCurriculumSection | `course/CourseDetailsCurriculumSection.tsx` |
| CourseCurriculumAccordion | `course/CourseCurriculumAccordion.tsx` |
| CourseFacultySection | `course/CourseFacultySection.tsx` |
| CourseIncludedScheduleSection | `course/CourseIncludedScheduleSection.tsx` |
| CoursePricingSection | `course/CoursePricingSection.tsx` |
| CourseTestimonialsSection | `course/CourseTestimonialsSection.tsx` |
| CourseRelatedSection | `course/CourseRelatedSection.tsx` (category-style course carousel + 3s autoplay) |
| CourseFaqSection | `course/CourseFaqSection.tsx` |
| CourseEnquireStickyBar | `course/CourseEnquireStickyBar.tsx` (mobile Enquire Now → enquiry modal) |

## Cards — `src/components/cards/`

| Component | File |
|-----------|------|
| AdvisorCard | `AdvisorCard.tsx` |
| BlogCard | `BlogCard.tsx` (`variant?: "overlay" \| "article"`; overlay = dark legacy homepage card; article = light listing/detail card with category link, calendar/clock meta) |
| CourseCard | `CourseCard.tsx` |
| CourseCardV2 | `CourseCardV2.tsx` (MBA light poster cards; optional `href`; optional `ctaLabel`, default "View Details") |
| CoursePurchaseCard | `CoursePurchaseCard.tsx` (sticky enrol card: thumbnail, benefits, price, Buy Now, Rodha Buddy) |
| PricingPlanCard | `PricingPlanCard.tsx` (light pricing tier card; optional Most Popular) |
| ExamCard | `ExamCard.tsx` (optional `onCounsellingSelect` opens modal instead of category link) |
| FacultyCard | `FacultyCard.tsx` |
| FacultyCardV2 | `FacultyCardV2.tsx` (MBA premium white; optional `variant="detail"` with bio + View Profile) |
| FacultyExpertCard | `FacultyExpertCard.tsx` |
| FacultyListingCard | `FacultyListingCard.tsx` |
| FacultyStatCard | `FacultyStatCard.tsx` (dark hero stat; `FacultyIcon` / react-icons) |
| FacultyInfoCard | `FacultyInfoCard.tsx` (light-theme card; quote variant) |
| FacultyCourseCard | `FacultyCourseCard.tsx` (light-theme; `FacultyIcon`) |
| FacultyAchievementCard | `FacultyAchievementCard.tsx` (light-theme + trophy illustration) |
| FacultyPublicationCard | `FacultyPublicationCard.tsx` (light-theme publication rows) |
| FacultyReviewCard | `FacultyReviewCard.tsx` (light-theme review list) |
| FacultyVideoCard / FacultyVideosPanel | `FacultyVideoCard.tsx` (light-theme; play via `FacultyIcon`) |
| FacultyResultStatCard | `FacultyResultStatCard.tsx` (orange value + optional description) |
| FeatureCard | `FeatureCard.tsx` |
| LeadershipCard | `LeadershipCard.tsx` |
| ResourceCard | `ResourceCard.tsx` |
| ResultStatCard | `ResultStatCard.tsx` |
| TestimonialCard | `TestimonialCard.tsx` |
| TestSeriesCard | `TestSeriesCard.tsx` |
| TestSeriesCardV2 | `TestSeriesCardV2.tsx` (MBA light theme; optional full-card poster image) |
| TopperCard | `TopperCard.tsx` |
| TopperCardV2 | `TopperCardV2.tsx` (homepage + category results; CAT percentile, IPMAT AIR rank, or Achiever/Topper placeholder) |
| TopperCardAlternate | `TopperCardAlternate.tsx` |
| ValuePropCard | `ValuePropCard.tsx` |
| YoutubeStoryCard | `YoutubeStoryCard.tsx` (YouTube thumbnail + student/subtitle; opens `StoriesModal`)

## Forms — `src/components/forms/`

| Component | File |
|-----------|------|
| ContactForm | `ContactForm.tsx` (light/dark `variant`; +91 phone chrome matching counselling; prefix icons; stub submit) |
| LeadCaptureForm | `LeadCaptureForm.tsx` (optional light variant, defaultExam, exam year, custom CTA — course Enquire Now) |
| NewsletterSignup | `NewsletterSignup.tsx` |
| StateSelectField | `StateSelectField.tsx` (loads `/api/states/dropdown`; wraps `DropdownSelect`) |

## Auth — `src/components/auth/`

| Component | File |
|-----------|------|
| AuthScreen | `AuthScreen.tsx` (login/signup form island; +91 phone; Google; no Apple) |
| AuthBannerSlider | `AuthBannerSlider.tsx` (full-bleed slides of `login-banner.png` + `rodha-logo.webp`) |
| GoogleContinueButton | `GoogleContinueButton.tsx` (GIS overlay + styled Continue with Google) |

## Account — `src/components/account/`

| Component | File |
|-----------|------|
| AccountShell | `AccountShell.tsx` (fixed sidebar + header; mobile drawer; wraps theme + `AccountUserProvider` / `userAtom`) |
| AccountSidebar | `AccountSidebar.tsx` (nav accordion, cart badge, Need Help) |
| AccountHeader | `AccountHeader.tsx` (mobile search overlay, Ctrl+K, theme toggle, notifications, Live Dashboard, profile/Logout) |
| AccountThemeProvider | `AccountThemeProvider.tsx` (`data-account-theme`; localStorage; circular transition) |
| AccountUserProvider | `providers/AccountUserProvider.tsx` (Jotai store + hydrate `userAtom` from `/auth/me`) |
| UpdateStateDialog | `UpdateStateDialog.tsx` (shared state picker → `PATCH /api/account/state`) |
| RequireStateGate | `RequireStateGate.tsx` (blocking dialog when `user.state` is null) |
| AccountPagination | `AccountPagination.tsx` (URL `Pagination` variant from account theme) |
| AccountContinueWatchingCard | `AccountContinueWatchingCard.tsx` (progress + Continue CTA; account theme tokens) |
| AccountContinueCoursesToolbar | `AccountContinueCoursesToolbar.tsx` (Continue tab search/filters + mobile BottomSheet) |
| AccountBuyCoursesToolbar | `AccountBuyCoursesToolbar.tsx` (Buy tab package search/filters + mobile BottomSheet) |
| AccountCourseDetailHeader | `course-detail/AccountCourseDetailHeader.tsx` |
| AccountCourseProgressCard | `course-detail/AccountCourseProgressCard.tsx` |
| AccountCourseContentTypeNav | `course-detail/AccountCourseContentTypeNav.tsx` (drag-scroll content-type tiles) |
| AccountCourseContentToolbar | `course-detail/AccountCourseContentToolbar.tsx` |
| AccountCourseContentCard | `course-detail/AccountCourseContentCard.tsx` |
| AccountRecommendedCard | `AccountRecommendedCard.tsx` (price/discount; optional `showCta` for dashboard vs cart) |
| WelcomeBanner | `WelcomeBanner.tsx` (dashboard greeting + orange name + illustration) |
| AccountSectionHeader | `AccountSectionHeader.tsx` (section title + View All link) |
| LearningProgressCard | `LearningProgressCard.tsx` (donut + completed/in-progress/not-started) |
| OrdersPreviewCard | `OrdersPreviewCard.tsx` (dashboard My Orders preview) |
| QuickLinksCard | `QuickLinksCard.tsx` (dashboard quick links) |
| AccountOrdersList | `AccountOrdersList.tsx` (desktop table + mobile cards; payment/order status badges) |
| AccountProfilePanel | `AccountProfilePanel.tsx` (avatar summary, edit name + change password; client-only) |
| CartPageClient | `CartPageClient.tsx` (cart/coupon state, recommended rail) |
| CartItemCard | `CartItemCard.tsx` (line item + remove) |
| CartOrderSummary | `CartOrderSummary.tsx` (sticky totals, coupon, Continue to Pay) |
| account-theme.css | Account-scoped CSS variables (light/dark; welcome/status/progress tokens) |

## Hooks — `src/hooks/`

| Hook | File |
|------|------|
| useCountdown | `useCountdown.ts` |
| useCounsellingModal | `useCounsellingModal.ts` |
| useInView | `useInView.ts` |

## Lib — `src/lib/`

| Module | File | Role |
|--------|------|------|
| constants | `constants.ts` | Site config, categories, trust metrics, value props |
| api client | `api/client.ts`, `api/env.ts`, `api/types.ts`, `api/query.ts` | Shared `apiGet` / `apiGetOrNull` / `apiPost`, env, envelope |
| api announcements | `api/modules/announcements/*` | Active announcements service + mapper |
| api banners | `api/modules/banners/*` | Shared `mapWebsiteBanner` (video over image) |
| api categories | `api/modules/categories/*` | Active categories + category page mapper (faculty/testimonials/stories/FAQs/courses) |
| api courses | `api/modules/courses/*` | Shared `mapCourses` + `mapCourseType` for static slider chips |
| api faculty | `api/modules/faculty/*` | Listing + by-slug; reuses course/faculty card mappers |
| api subjects | `api/modules/subjects/*` | Faculty listing subject filter |
| api about | `api/modules/about/*` | About banner, journeys, stacks, galleries |
| api team | `api/modules/team/*` | Team banner, featured faculty, galleries |
| api legal | `api/modules/legal/*` | Legal HTML + TOC from headings |
| api contact | `api/modules/contact/*` | CMS contact POST (proxied by `/api/leads`) |
| api auth | `api/modules/auth/*` | Student signup/login/google; session mapped; cookie set in Route Handlers |
| api home | `api/modules/home/*` | Get Home service + homepage view-model mapper |
| course-filters | `course-filters.ts` | Course type chips/dropdowns + paid/free helpers (`isCourseFree`, `isTestSeriesFree`) |
| course-sort | `course-sort.ts` | Packages listing sort presets (`sortBy`/`sortOrder` pairs for `/courses`) |
| session-cookie | `auth/session-cookie.ts` | httpOnly `rodha_access_token` apply/clear helpers |
| email/* | `email/config.ts`, `email/send.ts`, `email/parse-lead.ts`, `email/templates/lead-notification.ts` | SMTP + light Rodha lead email template |
| api blogs | `api/modules/blogs/*` | Listing + by-slug; `isFeatured` + `relatedBlogs` |
| form-validation | `form-validation.ts` | Name/phone/email/exam/message + password/confirm validators |
| account types | `account/types.ts` | Student dashboard models (user, continue watching, cart, orders, profile, widgets) |
| account cart totals | `account/cart-totals.ts` | `computeCartTotals` / `formatCartMoney` for cart summary |
| account pagination | `account/pagination.ts` | `paginateItems`, `parseCoursesTab` (continue/buy + aliases), page size 6 |
| course content filters | `account/course-content-filters.ts` | Content-type tabs, completion/live/result/sort enums + labels for assigned course UI |
| submit-lead | `submit-lead.ts` | Client helper → `POST /api/leads` |
| faculty-icons | `faculty-icons.tsx` | `FacultyIcon` — maps JSON icon keys to `react-icons` glyphs |
| initials | `initials.ts` | `getInitials(name)` for avatar fallbacks |
| structured-data | `structured-data.ts` | Server-rendered JSON-LD helpers (Organization, WebSite, Breadcrumb, FAQ, Person, BlogPosting) |
| seo | `seo.ts` | `buildPageMetadata` + `DEFAULT_OG_IMAGE` for canonical/OG/Twitter across marketing pages |
| types | `types.ts` | Shared domain types |
| utils | `utils.ts` | `cn()` helper |

## Data — `src/data/`

| Module | File |
|--------|------|
| account | `account/` — `user`, `dashboard`, `continue-watching`, `courses`, `test-series`, `orders`, `cart`, `recommended`, `profile` (static student dashboard foundation; types in `src/lib/account/types.ts`) |
| blog | `blog.ts` |
| about | `about.ts` |
| contact | `contact.ts` (page-only channels/address; does not replace Footer `CONTACT_INFO`) |
| category-landings | `category-landings.json` + `category-landings.ts` (SoT for all five category landings) |
| category-landing-defaults | `category-landing-defaults.ts` (`buildCategoryLandingFallback`, `withCategoryLandingDefaults` — name-based chrome for CMS categories without JSON) |
| course-details | `course-details.ts` (course detail resolver: slug lookup, defaults, faculty, related, FAQs) |
| courses | `courses.ts` (homepage / legacy) |
| faculty | `faculty.ts` (real profiles only; `selectFacultyReviews`, `getCoursesForFaculty`, `withFacultyDetailDefaults`) |
| faq | `faq.ts` |
| legal | `legal.ts` |
| navigation | `navigation.ts` |
| results | `results.ts` (homepage / legacy) |
| team | `team.ts` |
| home-impact | `home-impact.ts` |
| testimonials | `testimonials.ts` (homepage / legacy) |

---

## Public Assets — `public/assets/`

### Icons (`icons/`)
menu, close, chevron-down/left/right, search, user, faculty, ai-buddy, practice, guidance, top-faculty, mentorship, result-oriented, ai-powered, test-series, community, clock, video, book, users, star, star-half, star-outline, instagram, facebook, twitter, linkedin, youtube, phone, email, location, whatsapp, calendar, download, external-link, arrow-right, check, info, heart, play, quote, cat-icon, ipmat-icon, gdpi-icon, clat-icon, **playstore-svgrepo-com.svg** (full-colour Play Store badge)

### Images (`images/`)
rodha-logo.webp (official brand), rodha-logo.svg, rodha-logo-white.svg, rodha-logo-orange.svg, rodha-icon.svg  
**Hero:** hero/hero-home.png (homepage), hero/hero-main.jpg, hero/cat-hero.jpg  
**Exam 3D icons:** images/icons/cat-icon-3d.png, ipmat-icon-3d.png, gdpi-icon-3d.png, clat-icon-3d.png  
**Result stat icons:** images/icons/selection.png, images/icons/rank.png, images/icons/CAT-icon.png  
**Test series / CAT hero icons:** images/icons/ts-mocks.png, ts-sectional.png, ts-topic.png, ts-mini-mocks.png  
**Profiles (cutouts):** images/profiles/male-1..6.png, female-1..4.png (faculty, course, topper)  
**App promotion:** `app promotion/app mockup.png` (Rodha Buddy), `app promotion/mock_app_mockup.png` (Rodha App)  
**Faculty listing hero:** `images/faculty/listings page/hero-faulty.png`  
**Faculty detail:** `images/faculty/detail/results-podium.png` (results banner); achievements reuse `images/icons/rank.png`; hero decoration reuses listing `hero-faulty.png`  
**Courses / faculty / results / blog:** JPG assets under `images/courses`, `images/faculty`, `images/results`, `images/blog` (legacy)  
**Catalog listing hero:** `images/courses/banner/banner.png` (courses + test series listing)  
**Auth banner:** `auth/login-banner.png` (login/signup left panel)  
**CAT 2025 students:** 46 optimized WebP portraits under `images/category/cat/students/`, named by student slug and shared by result/testimonial records  
**IPMAT 2026 students:** 16 optimized WebP portraits under `images/category/ipmat/students/`, used on the IPMAT landing and homepage IPMAT results carousel  
**Placeholders:** hero-illustration, course-thumbnail, faculty-avatar, blog-thumbnail, topper-photo  
**Meet the Team (`images/meet the team/`):**  
- Hero: `team hero.png`  
- CTA: `Cta-left.png`  
- Icons (`icons/`): `hero-faculty.png`, `hero-experience-star.png`, `hero-student.png`, `culture-student-first.png`, `culture-integrity.png`, `culture-exelence.png`, `culture-collaborate.png`, `advisor-quote.svg`  
- Legacy SVG variants also present under `icons/`  
- Profiles: reuse `images/profiles/male-*.png`, `female-*.png` for leadership / faculty / advisors  
- Reuse global: `/assets/icons/linkedin.svg` (leadership cards)

### Backgrounds
hero-glow.svg, section-glow.svg, footer-gradient.svg, **backgrounds/home-cta-bg.png** (homepage footer CTA band)

### Patterns
dot-grid.svg, noise-texture.svg

### Shapes
blob-orange.svg, circle-gradient.svg, curved-divider.svg, ring-decoration.svg

---

## Design System Utilities (CSS)

Defined in `src/app/globals.css`: ... `body.home-gradient-page`, `.home-page-canvas`, `.home-page-canvas-glow`, `.home-on-light`, `.home-section-light`, `.home-light-heading`, `.home-light-body`, `.home-light-muted`, `.site-header`, `.impact-milestone-pill`, `.impact-stat-badge`, ...
