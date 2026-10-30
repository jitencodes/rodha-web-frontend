/**
 * Mock data for public Discussion Forum UI (manager review).
 * Shapes mirror Groups App APIs — Topics ≈ questions, Messages ≈ answers,
 * reactionTypeCount.like/dislike ≈ votes. Replace with SSR API later.
 */

export type ForumPreviewAuthor = {
  id: string;
  fullName: string;
  profilePicturePath: string | null;
  reputation?: number;
};

export type ForumPreviewTag = string;

export type ForumPreviewTagInfo = {
  name: string;
  description: string;
  questionCount: number;
  askedToday: number;
  askedThisWeek: number;
};

export type ForumPreviewQuestion = {
  id: number;
  groupId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: ForumPreviewTag[];
  voteScore: number;
  answerCount: number;
  viewCount: number;
  hasAcceptedAnswer: boolean;
  lastActivityAt: string;
  createdAt: string;
  author: ForumPreviewAuthor;
};

export type ForumPreviewAttachment = {
  id: number;
  filePath: string;
  fileName: string;
  mimeType: string;
  isImage: boolean;
};

export type ForumPreviewAnswer = {
  id: number;
  topicId: number;
  content: string;
  voteScore: number;
  isAccepted: boolean;
  createdAt: string;
  editedAt: string | null;
  author: ForumPreviewAuthor;
  reactionTypeCount: { like: number; dislike: number };
  myReaction?: "like" | "dislike" | null;
  attachments: ForumPreviewAttachment[];
};

export type ForumPreviewGroup = {
  id: number;
  name: string;
  description: string;
  seoSlug: string;
  topicCount: number;
  memberCount: number;
};

export const FORUM_PREVIEW_GROUP: ForumPreviewGroup = {
  id: 1,
  name: "CAT Open Forum",
  description: "Public doubt forum for CAT aspirants — ask, answer, and learn together.",
  seoSlug: "cat-open-forum",
  topicCount: 1284,
  memberCount: 4521,
};

export type ForumSpaceItem = {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  messageCount: number;
  lastActiveAt: string;
  iconUrl?: string | null;
  lastMessagePreview?: string | null;
  createdByName?: string | null;
  createdByRole?: string | null;
};

/** Mock group chats — visible only to logged-in users (portal Groups). */
export const FORUM_PREVIEW_GROUPS: ForumSpaceItem[] = [
  {
    id: 201,
    name: "CAT 2026 Study Circle",
    description: "Daily doubts, mock debriefs, and peer accountability for CAT 2026.",
    memberCount: 186,
    messageCount: 942,
    lastActiveAt: "2026-10-28T11:20:00.000+05:30",
  },
  {
    id: 202,
    name: "Quant Warriors",
    description: "Arithmetic, algebra, and geometry drills with mentors.",
    memberCount: 94,
    messageCount: 510,
    lastActiveAt: "2026-10-28T10:05:00.000+05:30",
  },
  {
    id: 203,
    name: "VARC Reading Room",
    description: "RC passages, para-jumbles, and vocabulary threads.",
    memberCount: 72,
    messageCount: 388,
    lastActiveAt: "2026-10-27T21:40:00.000+05:30",
  },
];

/** Mock channels — visible only to logged-in users (portal Channels). */
export const FORUM_PREVIEW_CHANNELS: ForumSpaceItem[] = [
  {
    id: 301,
    name: "#announcements",
    description: "Official Rodha updates, schedules, and live-class alerts.",
    memberCount: 4521,
    messageCount: 128,
    lastActiveAt: "2026-10-28T09:00:00.000+05:30",
  },
  {
    id: 302,
    name: "#mock-analysis",
    description: "Post-mock score shares and strategy discussions.",
    memberCount: 1204,
    messageCount: 670,
    lastActiveAt: "2026-10-28T12:10:00.000+05:30",
  },
  {
    id: 303,
    name: "#dilr-sets",
    description: "Share DILR sets and selection tips with the community.",
    memberCount: 860,
    messageCount: 445,
    lastActiveAt: "2026-10-28T08:35:00.000+05:30",
  },
];

export type ForumSpaceMember = {
  id: string;
  fullName: string;
  role: string;
  email?: string;
};

export type ForumSpaceMessage = {
  id: number;
  spaceId: number;
  content: string;
  createdAt: string;
  author: ForumPreviewAuthor;
  reactionTypeCount: { like: number; dislike: number };
  myReaction?: "like" | "dislike" | null;
  attachments?: ForumPreviewAttachment[];
  parentMessageId?: number | null;
  status?: string | null;
};

export const FORUM_SPACE_MEMBERS: Record<number, ForumSpaceMember[]> = {
  201: [
    { id: "m1", fullName: "Mentor — Quant Desk", role: "Mentor", email: "quant@rodha.in" },
    { id: "u3", fullName: "Priya Nair", role: "Student", email: "priya@example.com" },
    { id: "u1", fullName: "Ananya Sharma", role: "Student", email: "ananya@example.com" },
  ],
  202: [
    { id: "m1", fullName: "Mentor — Quant Desk", role: "Mentor" },
    { id: "u7", fullName: "Kabir Singh", role: "Student" },
  ],
  203: [
    { id: "m2", fullName: "Mentor — VARC Desk", role: "Mentor" },
    { id: "u2", fullName: "Rohan Mehta", role: "Student" },
  ],
  301: [
    { id: "sa", fullName: "System Admin", role: "Admin", email: "admin@rodha.in" },
    { id: "u3", fullName: "Priya Nair", role: "Student" },
  ],
  302: [
    { id: "m1", fullName: "Mentor — Quant Desk", role: "Mentor" },
    { id: "u7", fullName: "Kabir Singh", role: "Student" },
    { id: "u3", fullName: "Priya Nair", role: "Student" },
  ],
  303: [
    { id: "m1", fullName: "Mentor — Quant Desk", role: "Mentor" },
    { id: "u3", fullName: "Priya Nair", role: "Student" },
  ],
};

export const FORUM_SPACE_MESSAGES: Record<number, ForumSpaceMessage[]> = {
  201: [
    {
      id: 5001,
      spaceId: 201,
      content:
        "<p>Welcome to the CAT 2026 Study Circle. Share one takeaway from today’s mock in the thread below.</p>",
      createdAt: "2026-10-27T18:00:00.000+05:30",
      author: {
        id: "m1",
        fullName: "Mentor — Quant Desk",
        profilePicturePath: null,
        reputation: 12400,
      },
      reactionTypeCount: { like: 12, dislike: 0 },
    },
    {
      id: 5002,
      spaceId: 201,
      content:
        "<p>I left two DILR sets early and finished Quant clean — accuracy felt better. Anyone else trying set-abandon rules?</p>",
      createdAt: "2026-10-28T09:15:00.000+05:30",
      author: {
        id: "u3",
        fullName: "Priya Nair",
        profilePicturePath: null,
        reputation: 2650,
      },
      reactionTypeCount: { like: 8, dislike: 1 },
    },
  ],
  202: [
    {
      id: 5101,
      spaceId: 202,
      content: "<p>Today’s drill: 10 TSD questions in 18 minutes. Drop your score when done.</p>",
      createdAt: "2026-10-28T08:00:00.000+05:30",
      author: {
        id: "m1",
        fullName: "Mentor — Quant Desk",
        profilePicturePath: null,
        reputation: 12400,
      },
      reactionTypeCount: { like: 6, dislike: 0 },
    },
  ],
  203: [
    {
      id: 5201,
      spaceId: 203,
      content: "<p>RC tip: map each close option back to a line in the passage before you pick.</p>",
      createdAt: "2026-10-27T20:10:00.000+05:30",
      author: {
        id: "m2",
        fullName: "Mentor — VARC Desk",
        profilePicturePath: null,
        reputation: 9800,
      },
      reactionTypeCount: { like: 15, dislike: 0 },
    },
  ],
  301: [
    {
      id: 5301,
      spaceId: 301,
      content:
        "<p><strong>Announcement:</strong> Live strategy session this Sunday 6 PM. Link will be posted here.</p>",
      createdAt: "2026-10-28T09:00:00.000+05:30",
      author: {
        id: "sa",
        fullName: "System Admin",
        profilePicturePath: null,
        reputation: 50000,
      },
      reactionTypeCount: { like: 42, dislike: 0 },
    },
    {
      id: 5302,
      spaceId: 301,
      content: "<p>Mock schedule for Nov is live on the dashboard. Check your slot and confirm attendance.</p>",
      createdAt: "2026-10-28T09:05:00.000+05:30",
      author: {
        id: "sa",
        fullName: "System Admin",
        profilePicturePath: null,
        reputation: 50000,
      },
      reactionTypeCount: { like: 28, dislike: 0 },
    },
  ],
  302: [
    {
      id: 5401,
      spaceId: 302,
      content: "<p>Scored 92 in Mock 14. Quant held, VARC slipped on 2 close RCs. Sharing analysis notes soon.</p>",
      createdAt: "2026-10-28T11:40:00.000+05:30",
      author: {
        id: "u7",
        fullName: "Kabir Singh",
        profilePicturePath: null,
        reputation: 1120,
      },
      reactionTypeCount: { like: 5, dislike: 0 },
    },
  ],
  303: [
    {
      id: 5501,
      spaceId: 303,
      content:
        "<p>Uploaded a hard set on circular arrangements. Attempt without looking at options first.</p>",
      createdAt: "2026-10-28T08:20:00.000+05:30",
      author: {
        id: "m1",
        fullName: "Mentor — Quant Desk",
        profilePicturePath: null,
        reputation: 12400,
      },
      reactionTypeCount: { like: 9, dislike: 0 },
    },
  ],
};

export function getForumSpaceById(
  id: number,
  kind: "groups" | "channels"
): ForumSpaceItem | null {
  const list = kind === "groups" ? FORUM_PREVIEW_GROUPS : FORUM_PREVIEW_CHANNELS;
  return list.find((item) => item.id === id) ?? null;
}

export const FORUM_PREVIEW_QUESTIONS: ForumPreviewQuestion[] = [
  {
    id: 101,
    groupId: 1,
    title: "How to approach Time-Speed-Distance when trains cross each other?",
    slug: "tsd-trains-crossing",
    content:
      "<p>I keep mixing up relative speed for trains moving in the same vs opposite directions. Can someone share a clean approach with one worked example for each case?</p><p>Also — does the length of both trains always get added when they cross each other?</p>",
    excerpt:
      "I keep mixing up relative speed for trains moving in the same vs opposite directions. Can someone share a clean approach with one worked example…",
    tags: ["quant", "time-speed-distance", "cat"],
    voteScore: 24,
    answerCount: 5,
    viewCount: 812,
    hasAcceptedAnswer: true,
    lastActivityAt: "2026-10-28T09:40:00.000+05:30",
    createdAt: "2026-10-27T18:20:00.000+05:30",
    author: {
      id: "u1",
      fullName: "Ananya Sharma",
      profilePicturePath: null,
      reputation: 1840,
    },
  },
  {
    id: 102,
    groupId: 1,
    title: "RC: how to eliminate close options without overthinking?",
    slug: "rc-eliminate-options",
    content:
      "<p>In CAT RCs I often shortlist two options and then pick the wrong one. What process do you use to eliminate close options quickly?</p>",
    excerpt:
      "In CAT RCs I often shortlist two options and then pick the wrong one. What process do you use to eliminate close options quickly?",
    tags: ["varc", "reading-comprehension", "strategy"],
    voteScore: 18,
    answerCount: 3,
    viewCount: 540,
    hasAcceptedAnswer: false,
    lastActivityAt: "2026-10-28T08:15:00.000+05:30",
    createdAt: "2026-10-28T07:50:00.000+05:30",
    author: {
      id: "u2",
      fullName: "Rohan Mehta",
      profilePicturePath: null,
      reputation: 920,
    },
  },
  {
    id: 103,
    groupId: 1,
    title: "DILR set selection — when to leave a set mid-way?",
    slug: "dilr-set-selection",
    content:
      "<p>I waste 8–10 minutes on hard sets. How do you decide to leave a set after the first 3–4 minutes?</p>",
    excerpt:
      "I waste 8–10 minutes on hard sets. How do you decide to leave a set after the first 3–4 minutes?",
    tags: ["dilr", "mocks", "strategy"],
    voteScore: 31,
    answerCount: 7,
    viewCount: 1204,
    hasAcceptedAnswer: true,
    lastActivityAt: "2026-10-27T22:10:00.000+05:30",
    createdAt: "2026-10-26T14:00:00.000+05:30",
    author: {
      id: "u3",
      fullName: "Priya Nair",
      profilePicturePath: null,
      reputation: 2650,
    },
  },
  {
    id: 104,
    groupId: 1,
    title: "Permutation with identical objects — last step confusion",
    slug: "permutation-identical-objects",
    content:
      "<p>For arrangements of letters in MISSISSIPPI I understand the formula, but I get stuck when restrictions like “no two S together” are added. Walkthrough please?</p>",
    excerpt:
      "For arrangements of letters in MISSISSIPPI I understand the formula, but I get stuck when restrictions like “no two S together” are added…",
    tags: ["quant", "permutations", "combinatorics"],
    voteScore: 9,
    answerCount: 1,
    viewCount: 210,
    hasAcceptedAnswer: false,
    lastActivityAt: "2026-10-28T06:05:00.000+05:30",
    createdAt: "2026-10-28T05:40:00.000+05:30",
    author: {
      id: "u4",
      fullName: "Vikram Joshi",
      profilePicturePath: null,
      reputation: 410,
    },
  },
  {
    id: 105,
    groupId: 1,
    title: "Is it worth revising Geometry formulas in the last 30 days?",
    slug: "geometry-last-30-days",
    content:
      "<p>My Geometry accuracy is ~40%. With one month left, should I still invest time revising full Geometry or focus only on Arithmetic + Algebra?</p>",
    excerpt:
      "My Geometry accuracy is ~40%. With one month left, should I still invest time revising full Geometry or focus only on Arithmetic + Algebra?",
    tags: ["quant", "geometry", "preparation"],
    voteScore: 12,
    answerCount: 0,
    viewCount: 156,
    hasAcceptedAnswer: false,
    lastActivityAt: "2026-10-28T09:55:00.000+05:30",
    createdAt: "2026-10-28T09:55:00.000+05:30",
    author: {
      id: "u5",
      fullName: "Sneha Kapoor",
      profilePicturePath: null,
      reputation: 155,
    },
  },
  {
    id: 106,
    groupId: 1,
    title: "Para-jumbles: how to lock the opening sentence faster?",
    slug: "para-jumbles-opening",
    content:
      "<p>I spend too long finding the opening sentence in TITA PJs. Any reliable signals beyond “pronouns can’t open”?</p>",
    excerpt:
      "I spend too long finding the opening sentence in TITA PJs. Any reliable signals beyond “pronouns can’t open”?",
    tags: ["varc", "para-jumbles", "tita"],
    voteScore: 6,
    answerCount: 2,
    viewCount: 98,
    hasAcceptedAnswer: false,
    lastActivityAt: "2026-10-27T16:30:00.000+05:30",
    createdAt: "2026-10-27T12:00:00.000+05:30",
    author: {
      id: "u6",
      fullName: "Aditya Rao",
      profilePicturePath: null,
      reputation: 680,
    },
  },
];

export const FORUM_PREVIEW_TAGS: ForumPreviewTagInfo[] = [
  {
    name: "quant",
    description:
      "Quantitative Aptitude — arithmetic, algebra, numbers, and problem-solving for CAT & related exams.",
    questionCount: 1842,
    askedToday: 4,
    askedThisWeek: 28,
  },
  {
    name: "varc",
    description:
      "Verbal Ability & Reading Comprehension — RCs, para-jumbles, odd-one-out, and vocab usage.",
    questionCount: 1260,
    askedToday: 2,
    askedThisWeek: 19,
  },
  {
    name: "dilr",
    description:
      "Data Interpretation & Logical Reasoning — sets, graphs, puzzles, and selection strategy.",
    questionCount: 980,
    askedToday: 3,
    askedThisWeek: 22,
  },
  {
    name: "time-speed-distance",
    description: "TSD, relative speed, trains, boats, and races — a core Quant topic cluster.",
    questionCount: 412,
    askedToday: 1,
    askedThisWeek: 9,
  },
  {
    name: "reading-comprehension",
    description: "Passage-based questions: main idea, inference, tone, and option elimination.",
    questionCount: 756,
    askedToday: 2,
    askedThisWeek: 14,
  },
  {
    name: "strategy",
    description: "Mock strategy, section order, time management, and attempt selection tips.",
    questionCount: 534,
    askedToday: 5,
    askedThisWeek: 31,
  },
  {
    name: "mocks",
    description: "Full-length and sectional mock discussion, analysis, and score benchmarking.",
    questionCount: 621,
    askedToday: 6,
    askedThisWeek: 40,
  },
  {
    name: "permutations",
    description: "Arrangements, restrictions, identical objects, and related combinatorics.",
    questionCount: 198,
    askedToday: 0,
    askedThisWeek: 4,
  },
  {
    name: "combinatorics",
    description: "Counting principles, selections, and advanced PnC for competitive exams.",
    questionCount: 265,
    askedToday: 1,
    askedThisWeek: 6,
  },
  {
    name: "geometry",
    description: "Triangles, circles, mensuration, and coordinate geometry for Quant.",
    questionCount: 387,
    askedToday: 1,
    askedThisWeek: 8,
  },
  {
    name: "preparation",
    description: "Study plans, revision calendars, and last-month prep discussions.",
    questionCount: 449,
    askedToday: 3,
    askedThisWeek: 17,
  },
  {
    name: "para-jumbles",
    description: "Sentence rearrangement (MCQ & TITA) — openings, links, and closing cues.",
    questionCount: 312,
    askedToday: 0,
    askedThisWeek: 5,
  },
  {
    name: "tita",
    description: "Type-in-the-answer questions — approach, traps, and accuracy tips.",
    questionCount: 221,
    askedToday: 1,
    askedThisWeek: 7,
  },
  {
    name: "cat",
    description: "CAT-specific doubts, cutoffs, slot discussion, and exam-day notes.",
    questionCount: 2104,
    askedToday: 8,
    askedThisWeek: 55,
  },
  {
    name: "algebra",
    description: "Equations, inequalities, functions, and progressions for Quant.",
    questionCount: 508,
    askedToday: 2,
    askedThisWeek: 11,
  },
  {
    name: "arithmetic",
    description: "Percentages, ratios, averages, mixtures, and profit-loss fundamentals.",
    questionCount: 672,
    askedToday: 3,
    askedThisWeek: 16,
  },
];

export const FORUM_PREVIEW_ANSWERS: Record<number, ForumPreviewAnswer[]> = {
  101: [
    {
      id: 1001,
      topicId: 101,
      content:
        "<p><strong>Opposite directions:</strong> relative speed = sum of speeds. Time to cross = (L1 + L2) / (S1 + S2).</p><p><strong>Same direction:</strong> relative speed = difference. Time = (L1 + L2) / |S1 − S2|.</p><p>Yes — when two trains <em>cross</em> each other, add both lengths. When a train crosses a platform/pole, use train length + platform length (pole = 0).</p>",
      voteScore: 19,
      isAccepted: true,
      createdAt: "2026-10-27T19:10:00.000+05:30",
      editedAt: null,
      author: {
        id: "m1",
        fullName: "Mentor — Quant Desk",
        profilePicturePath: null,
        reputation: 12400,
      },
      reactionTypeCount: { like: 19, dislike: 0 },
      attachments: [],
    },
    {
      id: 1002,
      topicId: 101,
      content:
        "<p>Quick mnemonic: <em>same → subtract, opposite → add</em>. I also sketch a tiny timeline for the first 10 seconds of motion — helps avoid sign mistakes under timed pressure.</p>",
      voteScore: 7,
      isAccepted: false,
      createdAt: "2026-10-27T20:00:00.000+05:30",
      editedAt: "2026-10-27T20:12:00.000+05:30",
      author: {
        id: "u7",
        fullName: "Kabir Singh",
        profilePicturePath: null,
        reputation: 1120,
      },
      reactionTypeCount: { like: 8, dislike: 1 },
      attachments: [],
    },
  ],
  102: [
    {
      id: 1003,
      topicId: 102,
      content:
        "<p>Map each remaining option back to a specific line in the passage. The wrong one usually adds a scope word (“always”, “only”, “must”) that the author never committed to.</p>",
      voteScore: 11,
      isAccepted: false,
      createdAt: "2026-10-28T08:00:00.000+05:30",
      editedAt: null,
      author: {
        id: "m2",
        fullName: "Mentor — VARC Desk",
        profilePicturePath: null,
        reputation: 9800,
      },
      reactionTypeCount: { like: 11, dislike: 0 },
      attachments: [],
    },
  ],
  105: [],
};

export function formatForumRelativeTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const diffMs = Date.now() - date.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function formatForumCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}
