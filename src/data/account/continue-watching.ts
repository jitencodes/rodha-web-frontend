import type { ContinueWatchingItem } from "@/lib/account/types";

const CAT = "/assets/images/courses/cat";

/**
 * In-progress learnings for Dashboard + Courses (Continue Watching tab).
 * Sized for pagination demos (~10 items).
 */
export const ACCOUNT_CONTINUE_WATCHING: ContinueWatchingItem[] = [
  {
    id: "cw-r8-comprehensive",
    title: "CAT 2026 | R8 (Hinglish) Comprehensive Batch",
    tag: "MBA",
    thumbnail: `${CAT}/cat-2026-r8-hinglish-comprehensive-batch.jpg`,
    durationLabel: "32:15",
    progressCurrent: 12,
    progressTotal: 45,
    progressLabel: "12 of 45 lectures",
    href: "/account/courses?tab=continue",
  },
  {
    id: "cw-quant-booster",
    title: "CAT 2026 Quant Booster Course",
    tag: "MBA",
    thumbnail: `${CAT}/high-intensity-quants-batch-for-cat-2026-r6.jpg`,
    durationLabel: "28:40",
    progressCurrent: 8,
    progressTotal: 30,
    progressLabel: "8 of 30 lectures",
    href: "/account/courses?tab=continue",
  },
  {
    id: "cw-mock-series",
    title: "CAT 2026 Mock Test Series",
    tag: "MBA",
    thumbnail: `${CAT}/rodha-cat-mocks.png`,
    durationLabel: "45:20",
    progressCurrent: 5,
    progressTotal: 20,
    progressLabel: "5 of 20 tests",
    href: "/account/courses?tab=continue",
  },
  {
    id: "cw-varc-booster",
    title: "CAT 2026 VARC Booster Course",
    tag: "MBA",
    thumbnail: `${CAT}/high-intensity-varc-batch-for-cat-2026-r6.jpg`,
    durationLabel: "36:10",
    progressCurrent: 10,
    progressTotal: 28,
    progressLabel: "10 of 28 lectures",
    href: "/account/courses?tab=continue",
  },
  {
    id: "cw-lrdi-booster",
    title: "CAT 2026 LRDI Booster Course",
    tag: "MBA",
    thumbnail: `${CAT}/high-intensity-lrdi-course-for-cat-2026-r6.jpg`,
    durationLabel: "41:05",
    progressCurrent: 6,
    progressTotal: 24,
    progressLabel: "6 of 24 lectures",
    href: "/account/courses?tab=continue",
  },
  {
    id: "cw-r7-comprehensive",
    title: "CAT 2026 | R7 (Hinglish) Comprehensive Batch",
    tag: "MBA",
    thumbnail: `${CAT}/cat-2026-r7-hinglish-comprehensive-batch.jpg`,
    durationLabel: "22:50",
    progressCurrent: 18,
    progressTotal: 50,
    progressLabel: "18 of 50 lectures",
    href: "/account/courses?tab=continue",
  },
  {
    id: "cw-r5-quant",
    title: "CAT 2026 | R5 Zero to Zenith Quantitative Aptitude",
    tag: "MBA",
    thumbnail: `${CAT}/cat-2026-r5-batch-zero-to-zenith-quantitative-aptitude.jpg`,
    durationLabel: "19:30",
    progressCurrent: 4,
    progressTotal: 35,
    progressLabel: "4 of 35 lectures",
    href: "/account/courses?tab=continue",
  },
  {
    id: "cw-accelerator",
    title: "Rodha CAT Accelerator — Practice Engine",
    tag: "MBA",
    thumbnail: `${CAT}/rodha-cat-accelerator-the-ultimate-practice-engine.jpg`,
    durationLabel: "15:00",
    progressCurrent: 3,
    progressTotal: 16,
    progressLabel: "3 of 16 sessions",
    href: "/account/courses?tab=continue",
  },
  {
    id: "cw-r8-varc-fast",
    title: "CAT 2026 | R8 Zero to Zenith VARC Fast Paced",
    tag: "MBA",
    thumbnail: `${CAT}/cat-2026-r8-batch-zero-to-zenith-varc-fast-paced.jpg`,
    durationLabel: "27:45",
    progressCurrent: 9,
    progressTotal: 32,
    progressLabel: "9 of 32 lectures",
    href: "/account/courses?tab=continue",
  },
  {
    id: "cw-sectional-tests",
    title: "Rodha CAT Sectional & Topic Tests",
    tag: "MBA",
    thumbnail: `${CAT}/rodha-sectional-tests.png`,
    durationLabel: "50:00",
    progressCurrent: 7,
    progressTotal: 40,
    progressLabel: "7 of 40 tests",
    href: "/account/courses?tab=continue",
  },
];

/** First four items mirror the dashboard Continue Watching row in the UI reference. */
export const ACCOUNT_DASHBOARD_CONTINUE_WATCHING =
  ACCOUNT_CONTINUE_WATCHING.slice(0, 4);
