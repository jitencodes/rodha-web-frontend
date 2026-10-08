import type {
  DashboardQuickLink,
  DashboardWelcome,
  DashboardWidgets,
  LearningProgress,
} from "@/lib/account/types";
import { ACCOUNT_USER } from "@/data/account/user";
import { getSupportMailto } from "@/lib/constants";

export const ACCOUNT_WELCOME: DashboardWelcome = {
  greetingPrefix: "Welcome back,",
  message:
    "Continue your learning journey and get one step closer to your goals.",
  illustrationSrc: "/assets/images/icons/exam/mba-3d.png",
};

export const ACCOUNT_LEARNING_PROGRESS: LearningProgress = {
  percent: 60,
  completed: 6,
  inProgress: 3,
  notStarted: 4,
  title: "Your Learning Progress",
  encouragement: "Keep going! You're doing great.",
};

export const ACCOUNT_QUICK_LINKS: DashboardQuickLink[] = [
  {
    id: "explore-courses",
    label: "Explore All Courses",
    href: "/account/courses?tab=buy",
    icon: "courses",
  },
  // {
  //   id: "take-test",
  //   label: "Take a Test",
  //   href: "/account/test-series",
  //   icon: "test",
  // },
  // {
  //   id: "certificates",
  //   label: "View My Certificates",
  //   href: "/account/orders",
  //   icon: "certificate",
  // },
  {
    id: "update-profile",
    label: "Update Profile",
    href: "/account/profile",
    icon: "profile",
  },
  {
    id: "get-help",
    label: "Get Help",
    href: getSupportMailto(),
    icon: "help",
  },
];

/** Order ids shown in the dashboard "My Orders" preview widget. */
export const ACCOUNT_DASHBOARD_ORDER_PREVIEW_IDS = [
  "ord-r8-batch",
  "ord-quant-booster",
  "ord-mock-series",
] as const;

export const ACCOUNT_DASHBOARD_WIDGETS: DashboardWidgets = {
  learningProgress: ACCOUNT_LEARNING_PROGRESS,
  orderPreviewIds: [...ACCOUNT_DASHBOARD_ORDER_PREVIEW_IDS],
  quickLinks: ACCOUNT_QUICK_LINKS,
};

/** Convenience: first name used in the orange-highlighted welcome greeting. */
export const ACCOUNT_WELCOME_FIRST_NAME = ACCOUNT_USER.firstName;
