# Reusable Inventory

**Search this file and the codebase before creating anything new.**  
**Last updated:** 2026-08-20 (content & SEO migration)

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
| CountdownTimer | `CountdownTimer.tsx` |
| Divider | `Divider.tsx` |
| DropdownSelect | `DropdownSelect.tsx` (optional `variant?: "dark" \| "light"`, `prefixIcon`) |
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
| InfiniteMarquee | `infiniteMarquee.tsx` (continuous one-direction loop; respects `prefers-reduced-motion`) |

## Layout — `src/components/layout/`

| Component | File |
|-----------|------|
| Container | `Container.tsx` |
| Footer | `Footer.tsx` |
| CounsellingModalProvider | `CounsellingModalProvider.tsx` |
| FloatingCounsellingCta | `FloatingCounsellingCta.tsx` |
| Header | `Header.tsx` |
| MobileNav | `MobileNav.tsx` |
| PromotionalBanner | `PromotionalBanner.tsx` |

## Sections — `src/components/sections/`

| Component | File |
|-----------|------|
| CategoryHeroSection | `CategoryHeroSection.tsx` |
| CategoryLandingPage | `CategoryLandingPage.tsx` (JSON-driven CAT V2 stack for `/category/[slug]`) |
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
| HomeAppPromotionSection | `home/HomeAppPromotionSection.tsx` (optional eyebrow/title/description/className/mockupSrc; enriched copy + checklist) |
| LegalPageLayout | `LegalPageLayout.tsx` |
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

## Cards — `src/components/cards/`

| Component | File |
|-----------|------|
| AdvisorCard | `AdvisorCard.tsx` |
| BlogCard | `BlogCard.tsx` (`variant?: "overlay" \| "article"`; overlay = dark legacy homepage card; article = light listing/detail card with category link, calendar/clock meta) |
| CourseCard | `CourseCard.tsx` |
| CourseCardV2 | `CourseCardV2.tsx` (MBA light poster cards; View Details → course slug) |
| ExamCard | `ExamCard.tsx` (optional `onCounsellingSelect` opens modal instead of category link) |
| FacultyCard | `FacultyCard.tsx` |
| FacultyCardV2 | `FacultyCardV2.tsx` (MBA premium white: TopperCardV2 layout, image + light gradient detail border; no ratings) |
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
| TopperCardV2 | `TopperCardV2.tsx` (homepage + MBA results; supports AIR, percentile, or conversion result metric) |
| TopperCardAlternate | `TopperCardAlternate.tsx` |
| ValuePropCard | `ValuePropCard.tsx`

## Forms — `src/components/forms/`

| Component | File |
|-----------|------|
| ContactForm | `ContactForm.tsx` (light/dark `variant`; +91 phone chrome matching counselling; prefix icons; stub submit) |
| LeadCaptureForm | `LeadCaptureForm.tsx` |
| NewsletterSignup | `NewsletterSignup.tsx` |

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
| course-filters | `course-filters.ts` | `getVisibleCourseFilters` / `filterCoursesByType` — data-driven chips |
| email/* | `email/config.ts`, `email/send.ts`, `email/parse-lead.ts`, `email/templates/lead-notification.ts` | SMTP + light Rodha lead email template |
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
| blog | `blog.ts` |
| about | `about.ts` |
| contact | `contact.ts` (page-only channels/address; does not replace Footer `CONTACT_INFO`) |
| category-landings | `category-landings.json` + `category-landings.ts` (SoT for all five category landings) |
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
**App promotion:** `app promotion/app mockup.png` (homepage app section)  
**Faculty listing hero:** `images/faculty/listings page/hero-faulty.png`  
**Faculty detail:** `images/faculty/detail/results-podium.png` (results banner); achievements reuse `images/icons/rank.png`; hero decoration reuses listing `hero-faulty.png`  
**Courses / faculty / results / blog:** JPG assets under `images/courses`, `images/faculty`, `images/results`, `images/blog` (legacy)  
**CAT 2025 students:** 46 optimized WebP portraits under `images/category/cat/students/`, named by student slug and shared by result/testimonial records
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
