import { FAQ_DATA } from "@/data/faq";
import { EXTERNAL_URLS } from "@/lib/constants";
import type { FaqItem } from "@/lib/types";

export const CONTACT_HERO = {
  eyebrow: "WE'RE HERE FOR YOU",
  titleBefore: "Let's start a",
  titleHighlight: "conversation.",
  description:
    "Whether you need course guidance, a callback, or help choosing the right exam track — the Rodha team is ready to support your next step.",
} as const;

export const CONTACT_CHANNELS = {
  phone: "+91-7982212160",
  phoneHref: "tel:+919394324046",
  phoneHours: "Available 9 AM – 8 PM",
  whatsapp: "+91-9304491484",
  whatsappHref: "https://wa.me/917982212251",
  whatsappNote: "Chat with us",
  email: "contactus@rodha.co.in",
  emailHref: "mailto:contactus@rodha.co.in",
  emailNote: "We reply within 24 hrs",
  buddyLabel: "24/7 AI Study Assistant",
  buddyNote: "Ask doubts, get guidance",
  buddyHref: EXTERNAL_URLS.rodhaBuddy,
  address:
    "No. 7714, 7th Floor, Block C, Pranavas BSR Gitaaar, Panthur, Bangalore, Karnataka, 560103",
  mapEmbedSrc:
    "https://maps.google.com/maps?q=No.%207714%2C%207th%20Floor%2C%20Block%20C%2C%20Pranavas%20BSR%20Gitaaar%2C%20Panthur%2C%20Bangalore%2C%20Karnataka%2C%20560103&z=16&output=embed",
} as const;

export const CONTACT_SUPPORT_HOURS = [
  { id: "weekday", label: "Monday – Friday", value: "9:00 AM – 8:00 PM" },
  { id: "saturday", label: "Saturday", value: "9:00 AM – 6:00 PM" },
  { id: "sunday", label: "Sunday", value: "10:00 AM – 4:00 PM" },
] as const;

export const CONTACT_BENEFITS = [
  "Expert guidance from top mentors",
  "Personalized support for your goals",
  "Quick response and reliable help",
  "Trusted by thousands of aspirants",
] as const;

export const CONTACT_CTA = {
  title: "Your Success. Our Commitment.",
  subtitle: "Book a free counselling session or explore the course that matches your exam goal.",
} as const;

export const CONTACT_BUDDY = {
  eyebrow: "Need help?",
  title: "Your Success. Our Commitment.",
  description: "Book a free counselling session or explore the course that matches your exam goal.",
} as const;

const CONTACT_FAQ_IDS = ["gen-contact", "gen-5", "gen-6", "gen-3", "gen-4"] as const;

export const CONTACT_FAQS: FaqItem[] = [
  ...CONTACT_FAQ_IDS.map((id) => FAQ_DATA.find((item) => item.id === id))
    .filter((item): item is (typeof FAQ_DATA)[number] => Boolean(item))
    .map(({ id, question, answer }) => ({ id, question, answer })),
];
