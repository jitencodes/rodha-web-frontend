import type {
  AccountNavItem,
  AccountSupportCard,
  AccountUser,
} from "@/lib/account/types";

export const ACCOUNT_USER: AccountUser = {
  id: "user-jitendra-saini",
  firstName: "Jitendra",
  lastName: "Saini",
  fullName: "Jitendra Saini",
  email: "jitendra.saini@email.com",
  phone: "+91 98765 43210",
  avatarUrl: "/assets/images/profiles/male-1.png",
  hasUnreadNotifications: true,
};

export const ACCOUNT_SUPPORT_CARD: AccountSupportCard = {
  title: "Need Help?",
  description: "Get in touch with our support team for any assistance.",
  ctaLabel: "Contact Support",
  href: "mailto:support@rodha.co.in",
};

export const ACCOUNT_SEARCH_PLACEHOLDER =
  "Search for courses, test series, faculty...";

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/account/dashboard",
  },
  {
    id: "my-products",
    label: "My Products",
    children: [
      {
        id: "continue-watching",
        label: "Continue Watching",
        href: "/account/courses?tab=continue",
      },
      {
        id: "buy-courses",
        label: "Buy Courses",
        href: "/account/courses?tab=buy",
      },
      {
        id: "test-series",
        label: "Test Series",
        href: "/account/test-series",
      },
    ],
  },
  {
    id: "my-cart",
    label: "My Cart",
    href: "/account/cart",
    showCartBadge: true,
  },
  {
    id: "my-orders",
    label: "My Orders",
    href: "/account/orders",
  },
  {
    id: "my-profile",
    label: "My Profile",
    href: "/account/profile",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/account/settings",
  },
];
