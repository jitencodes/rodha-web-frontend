import type {
  Faculty,
  FacultyHeroStat,
  FacultyResultStat,
  FacultyReview,
  FacultyVideo,
  TeamHeroStat,
  ValueProp,
  CategoryId,
  Course,
  Testimonial,
  CategoryLandingConfig,
} from "@/lib/types";
import categoryLandingSource from "./category-landings.json";
import { CATEGORIES, getCategoryPath } from "@/lib/constants";

const categoryLandings =
  categoryLandingSource.categories as unknown as CategoryLandingConfig[];

const FACULTY_HERO_IMAGE = "/assets/images/faculty/listings page/hero-faulty.png";
export const FACULTY_DETAIL_DECORATION = FACULTY_HERO_IMAGE;
export const FACULTY_ACHIEVEMENT_IMAGE = "/assets/images/icons/rank.png";
export const FACULTY_RESULTS_PODIUM = "/assets/images/faculty/detail/results-podium.png";

/** Cutout portraits for Rodha faculty */
const FACULTY_PROFILE_DIR = "/assets/images/faculty/rodha faculty profile";

export function facultyProfileImage(filename: string): string {
  return `${FACULTY_PROFILE_DIR}/${filename}`;
}

function youtubeIdFromUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.replace(/^\//, "") || undefined;
    }
    return parsed.searchParams.get("v") ?? undefined;
  } catch {
    return undefined;
  }
}

function youtubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

function detailVideos(
  items: Array<{ id: string; title: string; href: string }>
): FacultyVideo[] {
  const videos: FacultyVideo[] = [];
  for (const item of items) {
    const youtubeId = youtubeIdFromUrl(item.href);
    if (!youtubeId) continue;
    videos.push({
      id: item.id,
      title: item.title,
      href: item.href,
      youtubeId,
      thumbnail: youtubeThumbnail(youtubeId),
    });
  }
  return videos;
}

export const FACULTY_HERO = {
  titleBefore: "Meet Our Expert",
  titleHighlight: "Faculty",
  description:
    "Learn from India's top educators - experienced mentors and industry professionals who have guided thousands of aspirants to their dream colleges and careers.",
  image: FACULTY_HERO_IMAGE,
  imageAlt: "Graduation cap on books with diploma scroll",
};

export const FACULTY_HERO_STATS: TeamHeroStat[] = [
  {
    id: "expert-faculty",
    value: "20+",
    label: "Expert Faculty",
    icon: "/assets/icons/top-faculty.svg",
  },
  {
    id: "subjects",
    value: "10+",
    label: "Subjects",
    icon: "/assets/icons/book.svg",
  },
  {
    id: "students",
    value: "1,00,000+",
    label: "Students Mentored",
    icon: "/assets/icons/users.svg",
  },
];

export const FACULTY_WHY_PROPS: ValueProp[] = [
  {
    id: "top-alumni",
    title: "IIM & NLU Alumni",
    description: "Learn from graduates of India's premier institutions",
    icon: "/assets/icons/top-faculty.svg",
  },
  {
    id: "proven-results",
    title: "Proven Track Record",
    description: "Faculty with thousands of successful selections",
    icon: "/assets/icons/result-oriented.svg",
  },
  {
    id: "personalized",
    title: "Personalized Guidance",
    description: "One-on-one mentorship tailored to your goals",
    icon: "/assets/icons/mentorship.svg",
  },
  {
    id: "structured",
    title: "Structured Pedagogy",
    description: "Concept-first teaching with exam-ready frameworks",
    icon: "/assets/icons/guidance.svg",
  },
  {
    id: "doubt-support",
    title: "24/7 Doubt Support",
    description: "AI-powered Rodha Buddy for round-the-clock help",
    icon: "/assets/icons/ai-buddy.svg",
  },
  {
    id: "live-interaction",
    title: "Live Interaction",
    description: "Interactive classes with real-time feedback",
    icon: "/assets/icons/video.svg",
  },
];

export const FACULTY_ITEMS_PER_PAGE = 15;

export const FACULTY_SORT_OPTIONS = [
  { value: "experience-desc", label: "Experience (High - Low)" },
  { value: "experience-asc", label: "Experience (Low - High)" },
  { value: "rating-desc", label: "Rating (High - Low)" },
  { value: "name-asc", label: "Name (A - Z)" },
  { value: "name-desc", label: "Name (Z - A)" },
] as const;

export type FacultySortKey = (typeof FACULTY_SORT_OPTIONS)[number]["value"];

export const FACULTY_CATEGORY_OPTIONS = [
  { value: "", label: "All Categories" },
  ...CATEGORIES.map((category) => ({
    value: category.id,
    label: category.name,
  })),
];

/** Real Rodha faculty only — enriched from Rodha Faculty (1).docx + category facultyIds */
export const faculty: Faculty[] = [
  {
    id: "faculty-profile-ravi",
    name: "Ravi Prakash",
    slug: "ravi",
    title: "Quant & LRDI Expert",
    designation: "Founder of RODHA | Expert in Quant & LRDI",
    badgeLabel: "Quant & LRDI Expert",
    qualification: "Founder of RODHA",
    specialization: ["Quantitative Aptitude", "LRDI"],
    experience: "10+ Years Exp.",
    bio: "10+ years training students for CAT and other MBA entrance exams; Quant & LRDI Educator at Unacademy CAT for 4 years.",
    about:
      "Ravi Prakash is the Founder of RODHA and an expert in Quantitative Aptitude and LRDI. With 10+ years training students for CAT and other MBA entrance exams, including 4 years as Quant & LRDI Educator at Unacademy CAT, he is known for high-quality, in-depth content and a concept-driven teaching style.",
    philosophy:
      "Clear, concept-driven approach to Quant and LRDI. Believes in the mantra \"Don't give up\", inspiring aspirants to stay motivated and overcome obstacles. Draws parallels between cricket and teaching — teamwork, strategy, and mental strength.",
    expertiseTags: ["Quantitative Aptitude", "LRDI", "Number System", "Arithmetic"],
    image: facultyProfileImage("Ravi Sir.png"),
    rating: 4.9,
    studentsMentored: "15K+",
    achievements: [
      "Times Power Icons — North 2024-25 | Exceptional Work in EdTech",
      "Ed Falcon Global Awards — India 2025 | Leading Educator of the Year",
      "Business Outline — Fastest Growing Education Company 2025",
      "World Education Conclave 2025 | Excellence in EdTech Industry",
      "KTCC Business Awards 2025 | Best Emerging Educational Services Company",
      "IIM Lucknow Entrepreneurship Cell — Enphilia 2025 | Speaker",
      "IIT Delhi — EdgeCon'25 | Speaker / Token of Appreciation",
      "Inspiring India 2024 | Featured Education Entrepreneur",
      "Economic Times — ET Newsmakers 2024 | Featured",
      "Media Feature — \"Ravi Prakash: Revolutionizing Education with Rodha\"",
      "YouTube channel RODHA with 460K+ subscribers known for high-quality, in-depth content",
    ],
    videos: detailVideos([
      {
        id: "ravi-v1",
        title: "Numbers 1: Real Rational Irrational Odd Even | Number System for CAT 2026",
        href: "https://www.youtube.com/watch?v=_g89_8Bb57g",
      },
      {
        id: "ravi-v2",
        title: "Speed Maths 1: Percentage of a Number | Arithmetic for CAT 2026",
        href: "https://www.youtube.com/watch?v=VT9-jeEmlJ8",
      },
      {
        id: "ravi-v3",
        title: "How to Prepare for CAT 2022 | Strategy | Topper Interview | 99.92 %ile",
        href: "https://www.youtube.com/watch?v=85mRs5qtBR0",
      },
    ]),
    categories: ["cat"],
    featured: true,
    honorificSuffix: "Sir",
    courseGraphyIds: [
      "696143bd014846015d507d1a", // R3
      "6994a4c4fa5dc43ee0be84b1", // R4
      "69ba4fc4e0ec761e5d7d6767", // R5
      "69f1de4c4408da0b6e7a24ca", // R7
      "6a29c1d4847de72d152cd9fe", // R8
      "6a720d6442d894118f9117d0", // Accelerator
      "6a5240f3d6493f282f8fb2db", // Crash
    ],
  },
  {
    id: "faculty-profile-kd",
    name: "Krishnendu Dutta (KD)",
    slug: "kd",
    title: "VARC Expert",
    designation: "VARC Expert | CAT Mentor | 20+ Years of Experience",
    badgeLabel: "VARC Expert",
    qualification: "VARC Expert | CAT Mentor",
    specialization: ["VARC", "Verbal Ability", "Reading Comprehension"],
    experience: "20+ Years Exp.",
    bio: "20+ years mentoring aspirants for CAT and other MBA entrance exams with a specialised focus on VARC.",
    about:
      "Krishnendu Dutta (KD) brings 20+ years of experience in CAT preparation, mentoring aspirants from premier colleges across India with a specialised focus on VARC. Beyond the classroom, he is an avid reader of contemporary non-fiction and enjoys swimming and playing the harmonica.",
    philosophy:
      "KD's approach goes beyond shortcuts and techniques, focusing on developing the underlying thinking required for success in VARC. He emphasises understanding an author's argument, recognising patterns in language and reasoning, evaluating options, and maintaining accuracy under pressure.",
    expertiseTags: ["VARC", "Reading Comprehension", "Verbal Ability", "Critical Reasoning"],
    image: facultyProfileImage("KD Sir.png"),
    rating: 4.9,
    studentsMentored: "14K+",
    achievements: [
      "Consistent 99+ percentile performer in VARC across CAT examinations over the past two decades",
      "Extensive expertise in Reading Comprehension, Verbal Ability, and critical reasoning",
    ],
    videos: detailVideos([
      {
        id: "kd-v1",
        title: "How to Solve Inference Based Questions | Critical Reasoning | Krishnendu Dutta",
        href: "https://www.youtube.com/watch?v=57NU-5tzBYA",
      },
      {
        id: "kd-v2",
        title: "CAT 2025 | VARC 99 percentile series: Common Struggles & Smart Solutions for RCs",
        href: "https://www.youtube.com/watch?v=01W-q2pQtnM",
      },
      {
        id: "kd-v3",
        title: "12 VARC Mistakes to AVOID in last 70 Days | KD Sir | CAT 2025",
        href: "https://www.youtube.com/watch?v=uR9j1nuw05I",
      },
    ]),
    categories: ["cat"],
    featured: true,
    honorificSuffix: "Sir",
    courseGraphyIds: [
      "69ba4fc4e0ec761e5d7d6767", // R5
      "69d21801ce25db80941bb9fb", // R6
      "6a29c1d4847de72d152cd9fe", // R8
    ],
  },
  {
    id: "faculty-profile-swapnil",
    name: "Swapanil Singhai",
    slug: "swapnil",
    title: "Quant & Reasoning Expert",
    designation: "AVP | Engineer + MBA | 20 Years of Teaching Excellence",
    badgeLabel: "Quant & Reasoning Expert",
    qualification: "Engineer + MBA",
    specialization: ["Quantitative Aptitude", "Reasoning"],
    experience: "20+ Years Exp.",
    bio: "20+ years in the education and test-prep industry; taught at leading national institutes before joining RODHA.",
    about:
      "Swapanil Singhai is AVP at Rodha with dual degrees in Engineering and MBA and 20+ years in the education and test-prep industry. He has taught at leading national institutes and trained 18,000+ students for competitive exams.",
    philosophy:
      "\"Genius is 1% talent and 99% hard work\" — blends hard practice with smart techniques. Breaks complex problems into simple, logical steps. Encourages understanding why a concept works, not just how.",
    expertiseTags: ["Quantitative Aptitude", "Reasoning", "Arithmetic", "Geometry"],
    image: facultyProfileImage("Swapanil Sir.png"),
    rating: 4.8,
    studentsMentored: "18K+",
    achievements: [
      "Dual degrees: Engineering + MBA",
      "Trained 18,000+ students for competitive exams",
    ],
    videos: detailVideos([
      {
        id: "swap-v1",
        title: "CAT 2026 Quants Roadmap | R2 Batch | LIVE with Rodha | Swapanil Sir",
        href: "https://www.youtube.com/watch?v=EkBsVTsuqN8",
      },
      {
        id: "swap-v2",
        title: "GEOMETRY MARATHON | ALL IMPORTANT CONCEPTS | By SWAPANIL SIR",
        href: "https://www.youtube.com/watch?v=uM7wKQfJlTM",
      },
      {
        id: "swap-v3",
        title: "Time & Work | Arithmetic | CAT 2026 Starts Here: Quants | Swapanil Sir",
        href: "https://www.youtube.com/watch?v=_nbG6PL7F9Y",
      },
    ]),
    categories: ["cat"],
    featured: true,
    honorificSuffix: "Sir",
    courseGraphyIds: [
      "69284e61fa407f6fb89efdae", // R2
      "69ba4fc4e0ec761e5d7d6767", // R5
      "69f1de4c4408da0b6e7a24ca", // R7
      "6a29c1d4847de72d152cd9fe", // R8
      "6a5240f3d6493f282f8fb2db", // Crash
    ],
  },
  {
    id: "faculty-profile-apoorv",
    name: "Apoorv Tandon",
    slug: "apoorv",
    title: "Quant & LRDI Mentor",
    designation: "Quant & LRDI Mentor | CAT Expert | 9+ Years of Teaching Experience",
    badgeLabel: "Quant & LRDI Mentor",
    qualification: "CAT Expert",
    specialization: ["Quantitative Aptitude", "LRDI"],
    experience: "9+ Years Exp.",
    bio: "9+ years mentoring students for competitive exams; taught at leading coaching institutes.",
    about:
      "Apoorv Tandon combines strong conceptual clarity with practical, exam-oriented problem-solving for QA and LRDI. A consistent CAT taker since 2017 with a personal best of 99.72 percentile overall (CAT 2019).",
    philosophy:
      "Combines strong conceptual clarity with practical, exam-oriented problem-solving. Helps students develop the right test strategy, speed, and accuracy. Builds confidence and curiosity through interactive, structured learning.",
    expertiseTags: ["Quantitative Aptitude", "LRDI", "Number System", "Games & Tournaments"],
    image: facultyProfileImage("Appoorv Sir.png"),
    rating: 4.8,
    studentsMentored: "12K+",
    achievements: [
      "1st position, International Young Mathematics Convention (Class 11)",
      "Consistent CAT taker since 2017; personal best 99.72 percentile overall (CAT 2019)",
      "Scored 99.9+ percentile six times in QA and LRDI",
    ],
    videos: detailVideos([
      {
        id: "apoorv-v1",
        title: "CAT 2025 | NUMBER SYSTEM | QUANTITATIVE APTITUDE | APOORV SIR",
        href: "https://www.youtube.com/watch?v=nAsOIxnfwT8",
      },
      {
        id: "apoorv-v2",
        title: "ONE SHOT Games & Tournaments | CAT 2025 LRDI Marathon | Apoorv Sir",
        href: "https://www.youtube.com/watch?v=5CCE51f59rk",
      },
      {
        id: "apoorv-v3",
        title: "LRDI Mastery Series | CAT 2025 | Apoorv Sir | Rodha",
        href: "https://www.youtube.com/watch?v=taBmprKDbfw",
      },
    ]),
    categories: ["cat"],
    featured: true,
    honorificSuffix: "Sir",
    courseGraphyIds: [
      "69284e61fa407f6fb89efdae", // R2
      "6994a4c4fa5dc43ee0be84b1", // R4
      "69d21801ce25db80941bb9fb", // R6
      "69f1de4c4408da0b6e7a24ca", // R7
      "6a29c1d4847de72d152cd9fe", // R8
      "6a5240f3d6493f282f8fb2db", // Crash
    ],
  },
  {
    id: "faculty-profile-brijesh",
    name: "Brijesh Pandey",
    slug: "brijesh",
    title: "Verbal Aptitude Expert",
    designation: "Senior Faculty | Verbal Aptitude Expert",
    badgeLabel: "Verbal Aptitude Expert",
    qualification: "Senior Faculty | Verbal Aptitude",
    specialization: ["VARC", "Critical Reasoning", "Verbal Ability"],
    experience: "13+ Years Exp.",
    bio: "3 years corporate experience, 4 years classroom teaching in Pune, 9 years running online CAT coaching, 15 months+ at Rodha.",
    about:
      "Brijesh Pandey is Senior Faculty for Verbal Aptitude at Rodha. He built Genesis Mentors in Pune and bodheeprep.com, one of the most visited sites for CAT preparation, before joining Rodha Educational Services.",
    philosophy:
      "Believes in building a strong conceptual base and engaging students in raw practice of questions in class.",
    expertiseTags: ["VARC", "Critical Reasoning", "Main Idea", "Verbal Ability"],
    image: facultyProfileImage("Brijesh Sir.png"),
    rating: 4.8,
    studentsMentored: "10K+",
    achievements: [
      "Built offline coaching institute in Pune — Genesis Mentors",
      "Built CAT online website www.bodheeprep.com, one of the top most visited sites for CAT preparation",
    ],
    videos: detailVideos([
      {
        id: "brijesh-v1",
        title: "Critical Reasoning | CAT 2025 | Brijesh Pandey Sir",
        href: "https://www.youtube.com/watch?v=X7htTuVsYa4",
      },
      {
        id: "brijesh-v2",
        title: "Main Idea Topic | Techniques for 99%ile | Brijesh Pandey Sir",
        href: "https://www.youtube.com/watch?v=myyJE04xWQA",
      },
      {
        id: "brijesh-v3",
        title: "CRITICAL REASONING | 68 Days to CAT | CAT 2025 | Brijesh Pandey Sir",
        href: "https://www.youtube.com/watch?v=n1m2khzqH68",
      },
    ]),
    categories: ["cat", "ipmat"],
    featured: true,
    honorificSuffix: "Sir",
    courseGraphyIds: [
      "69284e61fa407f6fb89efdae", // R2
      "69f1de4c4408da0b6e7a24ca", // R7
      "6a5240f3d6493f282f8fb2db", // Crash
      "69cc97f7acd9ed9fead97496", // IPMAT self-paced
      "69cc9530f38b155868692456", // Believers
      "6a156250e11d3ad64a0d361f", // Believers 2.0
      "6a42799300a1551241830ea2", // Believers 3.0
      "6a67a473ca6ad025db2731da", // Believers 4.0
      "6a1566d1233f055e19c811e2", // Nurture 2.0
      "6a4288f5a66dc899d4ac3841", // Nurture 3.0
      "6a67a1bbe481e638c9c5c5fb", // Nurture 4.0
      "69cc975d50eb201ada0c3cc1", // Nurture
    ],
  },
  {
    id: "faculty-profile-nikita",
    name: "Nikita Gupta",
    slug: "nikita",
    title: "Verbal Aptitude Expert",
    designation: "Verbal Aptitude Expert | TESOL Scholar | Language Educator",
    badgeLabel: "Verbal Aptitude Expert",
    qualification: "Alumna — SRCC & DSE | MSc TESOL, University of St Andrews",
    specialization: ["VARC", "Verbal Aptitude"],
    experience: "10+ Years Exp.",
    bio: "10+ years teaching Verbal Aptitude for MBA and Law entrance exams.",
    about:
      "Nikita Gupta is a Verbal Aptitude Expert, TESOL Scholar, and language educator. Alumna of SRCC & DSE with a Global Leadership Scholarship (2023) for MSc TESOL at the University of St Andrews. Multilingual: English, Hindi, and basic Mandarin.",
    philosophy:
      "Empathetic teaching — puts herself in the learner's shoes to craft relatable, effective learning experiences. Creative methods: explaining word roots with Harry Potter spells, humour for grammar concepts.",
    expertiseTags: ["VARC", "Reading Comprehension", "Para Summary", "Verbal Aptitude"],
    image: facultyProfileImage("Nikita Mam.png"),
    rating: 4.8,
    studentsMentored: "6K+",
    achievements: [
      "99.9%ile in Verbal on CAT and XAT; 111/120 in NMAT; 14/15 in SNAP",
      "IELTS band 8.5/9 with perfect 9 in Reading",
      "Alumna — SRCC & DSE; Global Leadership Scholarship (2023) — MSc TESOL, University of St Andrews",
      "Created and taught \"Essential Workplace English Skills\" at St Andrews",
    ],
    videos: detailVideos([
      {
        id: "nikita-v1",
        title: "CAT 2025 VARC The Final Mile | Ace ParaSummary | Nikita Ma'am",
        href: "https://www.youtube.com/watch?v=g9L7ooO9LRg",
      },
      {
        id: "nikita-v2",
        title: "VARC Educator LAUNCH | Techniques & Practice | Reading Comprehension",
        href: "https://www.youtube.com/watch?v=jBvn9w-8Zr0",
      },
      {
        id: "nikita-v3",
        title: "VARC GYM | Heavyweight VARC Questions | Nikita Gupta | CAT 2025",
        href: "https://www.youtube.com/watch?v=hC-w0TVvns8",
      },
    ]),
    categories: ["cat"],
    featured: true,
    honorificSuffix: "Ma'am",
    courseGraphyIds: [
      "696143bd014846015d507d1a", // R3
      "6994a4c4fa5dc43ee0be84b1", // R4
      "6a29c1d4847de72d152cd9fe", // R8
      "6a5240f3d6493f282f8fb2db", // Crash
    ],
  },
  {
    id: "faculty-profile-sharwari",
    name: "Sharwari Amte",
    slug: "sharwari",
    title: "Verbal Ability Expert",
    designation: "Experienced Educator | Verbal Ability Expert | Test-Prep Educator",
    badgeLabel: "Verbal Ability Expert",
    qualification: "Postgraduate in Engineering (full scholarship)",
    specialization: ["VARC", "Verbal Ability"],
    experience: "8+ Years Exp.",
    bio: "8+ years teaching Verbal Ability across major competitive exams including CAT, GRE, GMAT, CLAT, and IPMAT.",
    about:
      "Sharwari Amte is an experienced Verbal Ability educator with a postgraduate degree in engineering earned on a full scholarship. Fluent in English, Hindi, and Marathi.",
    philosophy:
      "Blends strong conceptual clarity with real-world application. Simplifies complex RC passages with relatable strategies and critical-thinking frameworks. Makes vocabulary engaging through active recall, storytelling, and context-based techniques.",
    expertiseTags: ["VARC", "Verbal Ability", "Reading Comprehension", "Vocabulary"],
    image: facultyProfileImage("Sharwari Mam.png"),
    rating: 4.7,
    studentsMentored: "4K+",
    achievements: [
      "Postgraduate degree in engineering, earned on a full scholarship",
      "Fluent in English, Hindi, and Marathi",
    ],
    videos: detailVideos([
      {
        id: "sharwari-v1",
        title: "EDITORIAL EXPLORER: IPMAT VARC BOOSTER | Part -17 | Sharwari Amte",
        href: "https://www.youtube.com/watch?v=txylEMW-M_k",
      },
      {
        id: "sharwari-v2",
        title: "CAT 2025 VARC The Final Mile | How to tackle VA in CAT? | Sharwari Ma'am",
        href: "https://www.youtube.com/watch?v=L5qgUUJCa5A",
      },
      {
        id: "sharwari-v3",
        title: "CAT 2026 VARC: Decoding RC vocab | Sharwari Mam",
        href: "https://www.youtube.com/watch?v=TZtpy3p6c0M",
      },
    ]),
    categories: ["cat", "ipmat"],
    featured: true,
    honorificSuffix: "Ma'am",
    courseGraphyIds: [
      "69cc97f7acd9ed9fead97496", // IPMAT self-paced
      "69cc9530f38b155868692456", // Believers
      "6a156250e11d3ad64a0d361f", // Believers 2.0
      "6a42799300a1551241830ea2", // Believers 3.0
      "6a67a473ca6ad025db2731da", // Believers 4.0
      "6a1566d1233f055e19c811e2", // Nurture 2.0
      "6a4288f5a66dc899d4ac3841", // Nurture 3.0
      "6a67a1bbe481e638c9c5c5fb", // Nurture 4.0
      "69cc975d50eb201ada0c3cc1", // Nurture
    ],
  },
  {
    id: "faculty-profile-abhishek-gupta",
    name: "Abhishek Gupta",
    slug: "abhishek-gupta",
    title: "Quant, DILR & CR Educator",
    designation: "Educator | Product Leader | Content Creator",
    badgeLabel: "Quant, DILR & CR",
    qualification: "Educator | Product Leader",
    specialization: ["Quantitative Aptitude", "DILR", "Critical Reasoning"],
    experience: "10+ Years Exp.",
    bio: "Led MBA test-prep at Career Launcher; founder of Meritshine. Teaching has reached close to a million learners.",
    about:
      "Abhishek Gupta led the MBA test-prep product at Career Launcher and founded Meritshine, an online aptitude-test preparation platform he ran for 10 years. His teaching has reached close to a million learners across Bank PO, SSC CGL, RBI Grade B, and CAT.",
    philosophy:
      "Makes learning engaging, intuitive, and memorable, often using cricket, sports and everyday experiences to explain complex concepts.",
    expertiseTags: ["Quantitative Aptitude", "DILR", "Critical Reasoning", "LRDI"],
    image: facultyProfileImage("Abhishek Gupta Sir.png"),
    rating: 4.9,
    studentsMentored: "11K+",
    achievements: [
      "Scored 100 percentile in CAT DILR multiple times",
      "Cracked XAT, SNAP, NMAT, GRE, and UPSC Prelims",
      "Built a following of 550,000+ learners on YouTube and 150,000+ members on Facebook",
    ],
    videos: detailVideos([
      {
        id: "ag-v1",
        title: "LRDI Faculty Launch with Abhishek Gupta | CAT 2025 Strategy + Top 10 FAQs",
        href: "https://www.youtube.com/watch?v=ImqVleqtf74",
      },
      {
        id: "ag-v2",
        title: "CAT DILR Strategy: When To Leave A Set And When To Stay | Abhishek Sir",
        href: "https://www.youtube.com/watch?v=VuoZYCfBTGU",
      },
      {
        id: "ag-v3",
        title: "LRDI CAT 2025 | LRDI Made Easy | Practice with Abhishek Gupta",
        href: "https://www.youtube.com/watch?v=IUs-bBMmf-8",
      },
    ]),
    categories: ["cat"],
    featured: true,
    honorificSuffix: "Sir",
    courseGraphyIds: [
      "6994a4c4fa5dc43ee0be84b1", // R4
      "69d21801ce25db80941bb9fb", // R6
    ],
  },
  {
    id: "faculty-profile-tarun",
    name: "Tarun Malik",
    slug: "tarun",
    title: "Aptitude Expert",
    designation: "Aptitude Expert | 23+ Years of Excellence in Test Prep & Mentoring",
    badgeLabel: "Aptitude Expert",
    qualification: "23+ Years Test Prep & Mentoring",
    specialization: ["Logical Reasoning", "Data Interpretation", "Quantitative Ability"],
    experience: "23+ Years Exp.",
    bio: "23+ years of teaching; 15+ years in management and product development; appeared in CAT 20 times.",
    about:
      "Tarun Malik brings 23+ years of teaching excellence and deep understanding of test formats from 22 CAT attempts. He focuses on creating impactful learning tools and mentors educators as well as students.",
    philosophy:
      "Deep understanding of test format, trends, and evolving difficulty levels from 22 CAT attempts. Focus on creating impactful learning tools and exam-prep strategies.",
    expertiseTags: ["Logical Reasoning", "Data Interpretation", "Quantitative Ability"],
    image: facultyProfileImage("Tarun Sir.png"),
    rating: 4.8,
    studentsMentored: "9K+",
    achievements: [
      "100%ile in QADI (CAT)",
      "99.99%ile in QA (XAT)",
      "Perfect 800/800 in SAT Math",
    ],
    videos: detailVideos([
      {
        id: "tarun-v1",
        title: "Smart Quant Tricks (Jugaads) Part 5 for Actual CAT Questions | Tarun Sir",
        href: "https://www.youtube.com/watch?v=ejtswn_M_bo",
      },
      {
        id: "tarun-v2",
        title: "LR DI practice session by Tarun Sir || CAT 2024",
        href: "https://www.youtube.com/watch?v=tkRkjaVxKSc",
      },
      {
        id: "tarun-v3",
        title: "XAT 2025 | Challenging Questions Part-1 | Quant DI | Previous Year",
        href: "https://www.youtube.com/watch?v=KzCtvlUo3DI",
      },
    ]),
    categories: ["cat"],
    featured: true,
    honorificSuffix: "Sir",
    // Doc lists only generic exam names with no Graphy links — hide courses section
    courseGraphyIds: [],
  },
  {
    id: "faculty-profile-sanchit",
    name: "Sanchit Gupta",
    slug: "sanchit",
    title: "Quant & Logical Reasoning Faculty",
    designation: "Faculty | IIT Jodhpur Alumnus | 8+ Years of Teaching Excellence",
    badgeLabel: "Quant & LR Faculty",
    qualification: "B.Tech Electrical Engineering, IIT Jodhpur",
    specialization: ["Quantitative Aptitude", "Logical Reasoning"],
    experience: "8+ Years Exp.",
    bio: "Teaching since 2018; worked with ALLEN, Unacademy, TIME, LPT, and Endeavour.",
    about:
      "Sanchit Gupta is an IIT Jodhpur alumnus teaching Quantitative Aptitude and Logical Reasoning since 2018. He has worked with ALLEN, Unacademy, TIME, LPT, and Endeavour.",
    philosophy:
      "Believes in transformation through learning — the right mentorship can turn average performance into excellence. Simplifies complex topics with relatable examples for long-term retention.",
    expertiseTags: ["Quantitative Aptitude", "Logical Reasoning", "Arithmetic", "Algebra"],
    image: facultyProfileImage("Sanchit Sir.png"),
    rating: 4.7,
    studentsMentored: "7K+",
    achievements: [
      "B.Tech Electrical Engineering, IIT Jodhpur",
      "99.9 percentile in CAT Quantitative Aptitude",
      "Qualified Regional Mathematics Olympiad (RMO)",
      "Cracked IIT-JEE 2012",
    ],
    videos: detailVideos([
      {
        id: "sanchit-v1",
        title: "XAT 2026 Quant Accelerator | Arithmetic – 1 | By IITian Sanchit Gupta",
        href: "https://www.youtube.com/watch?v=f981zGn404g",
      },
      {
        id: "sanchit-v2",
        title: "XAT 2026 Quant Accelerator | ALGEBRA - 2 | By IITian Sanchit Gupta",
        href: "https://www.youtube.com/watch?v=REg-p3H5OlY",
      },
    ]),
    categories: ["ipmat"],
    featured: true,
    honorificSuffix: "Sir",
    courseGraphyIds: [
      "69cc97f7acd9ed9fead97496", // IPMAT self-paced
      "69cc9530f38b155868692456", // Believers
      "6a156250e11d3ad64a0d361f", // Believers 2.0
      "6a42799300a1551241830ea2", // Believers 3.0
      "6a67a473ca6ad025db2731da", // Believers 4.0
      "6a1566d1233f055e19c811e2", // Nurture 2.0
      "6a4288f5a66dc899d4ac3841", // Nurture 3.0
      "6a67a1bbe481e638c9c5c5fb", // Nurture 4.0
      "69cc975d50eb201ada0c3cc1", // Nurture
    ],
  },
  {
    id: "faculty-profile-neeraj",
    name: "Neeraj Kukreja",
    slug: "neeraj",
    title: "Quant Mentor",
    designation: "Senior Faculty | Quant Mentor | 16+ Years of Teaching Excellence",
    badgeLabel: "Quant Mentor",
    qualification: "Senior Faculty | Quant Mentor",
    specialization: ["Quantitative Aptitude"],
    experience: "17+ Years Exp.",
    bio: "17+ years; worked with Adda247, BYJU'S, Unacademy, Career Launcher, KGS, and reputed offline institutes.",
    about:
      "Neeraj Kukreja is Senior Faculty for Quantitative Aptitude with 17+ years across Adda247, BYJU'S, Unacademy, Career Launcher, KGS, and reputed offline institutes. Fluent in Hindi and English.",
    philosophy:
      "\"Do what you love and love what you do.\" Lightning-fast calculations, multiple problem-solving methods, and strong conceptual clarity — helping students finish the syllabus in minimum time with maximum efficiency.",
    expertiseTags: ["Quantitative Aptitude", "Arithmetic", "Simple Interest", "Partnership"],
    image: facultyProfileImage("Neeraj Sir.png"),
    rating: 4.8,
    studentsMentored: "8K+",
    achievements: [
      "All India Rank 9 in SSC Quant",
      "99.99 percentile in CAT Quant",
    ],
    videos: detailVideos([
      {
        id: "neeraj-v1",
        title: "NMAT 2025 Marathon | MOST IMPORTANT Quantitative Aptitude Questions",
        href: "https://www.youtube.com/watch?v=H6-C_oN4Hmc",
      },
      {
        id: "neeraj-v2",
        title: "NMAT & SNAP | 99%ile Playbook | Simple Interest | Neeraj Kukreja",
        href: "https://www.youtube.com/watch?v=B7gpHri4Dsc",
      },
      {
        id: "neeraj-v3",
        title: "NMAT & SNAP | 99%ile Playbook | Partnership and Proportion",
        href: "https://www.youtube.com/watch?v=hX1PLClxD2E",
      },
    ]),
    categories: ["ssc"],
    featured: true,
    honorificSuffix: "Sir",
    courseGraphyIds: [
      "69b40fee3e453d46c8471399", // SSC Foundation 1
      "6a1936fb3fd25afd3805698d", // SSC Prime
    ],
  },
  {
    id: "faculty-profile-shrikant",
    name: "Shrikant Kaushik",
    slug: "shrikant",
    title: "Logical Reasoning & DI Expert",
    designation: "Senior Faculty | Logical Reasoning & DI Expert | 10+ Years of Transformative Teaching",
    badgeLabel: "LR & DI Expert",
    qualification: "Senior Faculty | LR & DI",
    specialization: ["Logical Reasoning", "Data Interpretation", "Decision Making"],
    experience: "10+ Years Exp.",
    bio: "10+ years; worked with TIME and other premier offline & online platforms.",
    about:
      "Shrikant Kaushik is Senior Faculty for Logical Reasoning, Data Interpretation, and Decision Making with 10+ years at TIME and other premier platforms. Bilingual mentor (Hindi & English).",
    philosophy:
      "\"Education isn't just about learning, it's about transformation.\" Crystal-clear explanations, shortcut techniques, and exam-focused strategies that maximise speed and accuracy under pressure.",
    expertiseTags: ["Logical Reasoning", "Data Interpretation", "Puzzles", "Decision Making"],
    image: facultyProfileImage("Shrikant Sir.png"),
    rating: 4.8,
    studentsMentored: "8K+",
    achievements: [
      "Consistently 99.5+ percentile in CAT LRDI",
      "Outstanding results in NMAT, SNAP, and MAH CET",
    ],
    videos: detailVideos([
      {
        id: "shrikant-v1",
        title: "CAT 2025 | PUZZLES WORKSHOP | SHRIKANT SIR | RODHA LIVE",
        href: "https://www.youtube.com/watch?v=58JnCAEgCXM",
      },
      {
        id: "shrikant-v2",
        title: "CAT 2025 | PUZZLES WORKSHOP - 2 | SHRIKANT SIR | RODHA LIVE",
        href: "https://www.youtube.com/watch?v=DpolMpMC0v0",
      },
      {
        id: "shrikant-v3",
        title: "Day 17 of 30 Days, 30 Puzzles for CAT 2025 | LRDI Practice with Shrikant Sir",
        href: "https://www.youtube.com/watch?v=1YDC7Rd9PFE",
      },
    ]),
    categories: ["ssc"],
    featured: true,
    honorificSuffix: "Sir",
    courseGraphyIds: [
      "69b40fee3e453d46c8471399", // SSC Foundation 1
      "6a1936fb3fd25afd3805698d", // SSC Prime
    ],
  },
  {
    id: "faculty-profile-himanshu",
    name: "Himanshu Kushwaha",
    slug: "himanshu",
    title: "General Studies Educator",
    designation: "Educator | General Studies",
    badgeLabel: "General Studies",
    qualification: "Educator | General Studies",
    specialization: ["General Studies", "GK & GS", "Polity"],
    experience: "10+ Years Exp.",
    bio: "10+ years of teaching and mentoring for SSC and other competitive examinations.",
    about:
      "Himanshu Kushwaha is an educator for General Studies with 10+ years of teaching and mentoring experience. He focuses on conceptual clarity, analytical thinking, effective answer writing, and strategic preparation for SSC aspirants.",
    philosophy:
      "Concept-based and exam-oriented teaching with a focus on conceptual clarity, analytical thinking, effective answer writing, and strategic preparation.",
    expertiseTags: ["General Studies", "Static GK", "Current Affairs", "Polity"],
    image: facultyProfileImage("Himanshu Sir.png"),
    rating: 4.8,
    studentsMentored: "Hundreds+",
    achievements: [
      "Successfully mentored hundreds of students selected in BPSC, UPPCS, CDS, CAPF, SSC and various other competitive examinations",
    ],
    videos: detailVideos([
      {
        id: "himanshu-v1",
        title: "Static GK Practice Session 2026 | SSC CGL | Most Expected Ques. | Himanshu Sir",
        href: "https://www.youtube.com/watch?v=CbznbcTyQik",
      },
    ]),
    courseGraphyIds: [
      "69b40fee3e453d46c8471399",
      "6a1936fb3fd25afd3805698d",
    ],
    categories: ["ssc"],
    featured: true,
    honorificSuffix: "Sir",
  },
  {
    id: "faculty-profile-divya",
    name: "Divya Kumar Garg",
    slug: "divya",
    title: "Current Affairs & Critical Reasoning",
    designation: "Faculty — Current Affairs & Critical Reasoning",
    badgeLabel: "Current Affairs & CR",
    qualification: "NLSIU Bangalore | IIM Ahmedabad | Ex-McKinsey",
    specialization: ["Current Affairs", "Critical Reasoning"],
    experience: "CLAT Mentor",
    bio: "Has mentored over 10,000 students for CLAT and other national law entrance examinations. Ex-McKinsey & Company. Alumnus of NLSIU Bangalore and IIM Ahmedabad.",
    about:
      "Divya Kumar Garg teaches Current Affairs and Critical Reasoning at Rodha. An alumnus of NLSIU Bangalore and IIM Ahmedabad and formerly at McKinsey & Company, he has mentored over 10,000 students for CLAT and other national law entrance examinations.",
    philosophy:
      "Prep should be intuitive, not exhausting. Focuses on making preparation intuitive rather than exhausting for students. Believes CLAT success is not built on \"hard work\" alone, but on building systems that are simple, sensible and repeatable.",
    expertiseTags: ["Current Affairs", "Critical Reasoning", "CLAT"],
    image: facultyProfileImage("Divya.png"),
    rating: 4.9,
    studentsMentored: "10K+",
    achievements: [
      "AIR 60 — CLAT",
      "AIR 17 — AILET",
      "NLSIU Bangalore",
      "MBA — IIM Ahmedabad (cracked CAT after law school)",
      "Ex-McKinsey & Co.",
      "10,000+ students mentored",
    ],
    videos: detailVideos([
      {
        id: "divya-v1",
        title: "Critical Reasoning | Session - 1 | CLAT 2027 | Divya Kumar Garg NLSIU'21",
        href: "https://www.youtube.com/watch?v=f9d_RldTRV4",
      },
      {
        id: "divya-v2",
        title: "CLAT 2027: Complete Current Affairs Of February 2026 | Divya Kumar Garg",
        href: "https://www.youtube.com/watch?v=Xi9vYk_pAYU",
      },
    ]),
    courseGraphyIds: ["69e36d2232524ce3800e8cbc"],
    categories: ["clat", "skillhouse"],
    featured: true,
    honorificSuffix: "Sir",
  },
  {
    id: "faculty-profile-kirti",
    name: "Kriti Bhatnagar",
    slug: "kirti",
    title: "Legal Reasoning Faculty",
    designation: "Faculty — Legal Reasoning",
    badgeLabel: "Legal Reasoning",
    qualification: "NLIU Bhopal | LLM GNLU | Ex-JGLS Faculty",
    specialization: ["Legal Reasoning"],
    experience: "5+ Years Exp.",
    bio: "5 years mentoring students for CLAT and law entrance examinations. Former Faculty — Jindal Global Law School (JGLS).",
    about:
      "Kriti Bhatnagar is Faculty for Legal Reasoning at Rodha. With 5 years mentoring CLAT and law entrance aspirants, and former faculty experience at Jindal Global Law School, she is a recognised top educator for CLAT aspirants.",
    philosophy:
      "Learn the law, and laugh while you do it. Makes Legal Reasoning approachable and enjoyable — classes feel like a stand-up set while mock scores go up. Believes the exam is not only about clearing concepts and taking mocks, but also about the right mindset and consistency.",
    expertiseTags: ["Legal Reasoning", "Constitution", "Torts", "Criminal Law"],
    image: facultyProfileImage("Kirti.png"),
    rating: 4.8,
    studentsMentored: "Thousands+",
    achievements: [
      "AIR 334 — CLAT",
      "BA LLB — NLIU Bhopal",
      "LLM — GNLU",
      "UGC NET qualified",
      "Ex-JGLS Faculty",
      "Top educator for CLAT aspirants",
    ],
    // Doc lists video titles without parseable YouTube URLs — omit rather than invent
    courseGraphyIds: ["69e36d2232524ce3800e8cbc"],
    categories: ["clat"],
    featured: true,
    honorificSuffix: "Ma'am",
  },
  {
    id: "faculty-profile-rupal",
    name: "Rupal Choudhary",
    slug: "rupal",
    title: "English Language Faculty",
    designation: "Faculty — English Language",
    badgeLabel: "English Language",
    qualification: "Faculty — English Language & Communication",
    specialization: ["English Language", "Communication"],
    experience: "1.5+ Years Exp.",
    bio: "1.5+ years of teaching with 75+ students mentored. Former school teacher with experience across online tutoring and classroom teaching.",
    about:
      "Rupal Choudhary is Faculty for English Language at Rodha. She creates English lessons for YouTube for learners and competitive exam aspirants, with experience as a former school teacher across online tutoring and classroom teaching.",
    philosophy:
      "Ask why before asking students to remember what. Teaches English through patterns, context and real usage rather than rote memorisation. Builds classes around conversation and questions instead of rules that \"just are\".",
    expertiseTags: ["English Language", "Communication", "Vocabulary", "Grammar"],
    image: facultyProfileImage("Rupal.png"),
    rating: 4.8,
    studentsMentored: "75+",
    achievements: [
      "Mentored 75+ students in 1.5 years",
      "YouTube educator — simplifies English concepts for learners and competitive exam aspirants",
      "Known for a clear, engaging teaching style",
      "Prior experience as a school teacher and online tutor",
    ],
    videos: detailVideos([
      {
        id: "rupal-v1",
        title: "Council vs Counsel: Stop Mixing These Up!",
        href: "https://www.youtube.com/watch?v=XTX_mEzgZLM",
      },
      {
        id: "rupal-v2",
        title: "English Language Tips | Rupal Ma'am",
        href: "https://www.youtube.com/watch?v=xHBv8-Njtc0",
      },
      {
        id: "rupal-v3",
        title: "English Practice | Rupal Ma'am",
        href: "https://www.youtube.com/watch?v=B2Wrq3JHtQk",
      },
    ]),
    courseGraphyIds: [
      "69b40fee3e453d46c8471399",
      "6a1936fb3fd25afd3805698d",
      "69e36d2232524ce3800e8cbc",
    ],
    categories: ["ssc", "clat"],
    featured: true,
    honorificSuffix: "Ma'am",
  },
  {
    id: "faculty-profile-ananya",
    name: "Ananya Singhal",
    slug: "ananya",
    title: "Quantitative Techniques & LR",
    designation: "Faculty — Quantitative Techniques & Logical Reasoning",
    badgeLabel: "QT & Logical Reasoning",
    qualification: "NLU Odisha | MDI Gurgaon | CLAT AIR 197",
    specialization: ["Quantitative Techniques", "Logical Reasoning"],
    experience: "8+ Years Exp.",
    bio: "8+ years teaching; mentored students into NLS, NALSAR and other top law schools. Author of 14 CLAT books published by Unacademy.",
    about:
      "Ananya Singhal is Faculty for Quantitative Techniques and Logical Reasoning at Rodha. With 8+ years of teaching experience, he has mentored students into NLS, NALSAR and other top law schools and authored 14 CLAT books published by Unacademy.",
    philosophy:
      "Strong basics. Logic over shortcuts. Focuses on the fundamentals that are essential for CLAT, making students fall in love with numbers and logical thinking. Believes maths is not magic but logic — once you understand the idea behind it, the trick becomes simple.",
    expertiseTags: [
      "Quantitative Techniques",
      "Logical Reasoning",
      "Analytical Reasoning",
      "Percentages",
    ],
    image: facultyProfileImage("Ananya.png"),
    rating: 4.9,
    studentsMentored: "Thousands+",
    achievements: [
      "CLAT AIR 197 (2017)",
      "BBA LLB — NLU Odisha (2021)",
      "MBA — MDI Gurgaon (2023)",
      "Multiple-time CAT 99+ percentiler",
      "Author of 14 CLAT books published by Unacademy",
      "Students mentored into NLS, NALSAR and other top NLUs",
    ],
    videos: detailVideos([
      {
        id: "ananya-v1",
        title: "Master Series & Coding-Decoding | Analytical Reasoning Made Easy!",
        href: "https://www.youtube.com/watch?v=gc8aNQHoSYQ",
      },
    ]),
    courseGraphyIds: ["69e36d2232524ce3800e8cbc"],
    categories: ["clat"],
    featured: true,
    honorificSuffix: "Sir",
  },
  {
    id: "faculty-profile-abhishek-dubey",
    name: "Abhishek Dubey",
    slug: "abhishek-dubey",
    title: "General Knowledge Faculty",
    designation: "Faculty — General Knowledge",
    badgeLabel: "General Knowledge",
    qualification: "Former HoD — General Knowledge",
    specialization: ["General Knowledge", "Current Affairs"],
    experience: "13+ Years Exp.",
    bio: "13+ years teaching; mentored 10,000+ UPSC and State PSC aspirants. Former Head of Department — General Knowledge.",
    about:
      "Abhishek Dubey is Faculty for General Knowledge at Rodha with 13+ years of teaching experience. A former Head of Department and Subject Matter Expert for General Knowledge, he has mentored 10,000+ UPSC and State PSC aspirants.",
    philosophy:
      "\"If a teacher doesn't enjoy the subject, they cannot truly inspire students to learn it.\" Believes concepts are the key to long-term learning. Combines stories, historical context and real-life examples to make General Knowledge engaging and memorable.",
    expertiseTags: ["General Knowledge", "Current Affairs", "History", "Static GK"],
    image: facultyProfileImage("Abhishek Dubey.png"),
    rating: 4.8,
    studentsMentored: "10K+",
    achievements: [
      "Published author with Pearson Publications",
      "Published author with Oswal Publications",
      "Recognised for developing high-quality General Knowledge content for competitive examinations",
      "10,000+ aspirants mentored across 13+ years",
    ],
    videos: detailVideos([
      {
        id: "ad-v1",
        title: "How Europe Hooked India: Vasco da Gama to the British Monopoly | CLAT 2027",
        href: "https://www.youtube.com/watch?v=pXf96y2OqUY",
      },
    ]),
    courseGraphyIds: [
      "69b40fee3e453d46c8471399",
      "6a1936fb3fd25afd3805698d",
      "69e36d2232524ce3800e8cbc",
    ],
    categories: ["ssc", "clat"],
    featured: true,
    honorificSuffix: "Sir",
  },
];

function getUniqueSubjects(list: Faculty[]): string[] {
  const subjects = new Set<string>();
  for (const member of list) {
    for (const spec of member.specialization) {
      subjects.add(spec.trim());
    }
  }
  return Array.from(subjects).sort((a, b) => a.localeCompare(b));
}

export const FACULTY_SUBJECTS = [
  { value: "", label: "All Subjects" },
  ...getUniqueSubjects(faculty).map((subject) => ({
    value: subject,
    label: subject,
  })),
];

export function parseExperienceYears(experience: string): number {
  const match = experience.match(/(\d+)\+/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Ordered featured list for Team + Faculty marquees. */
export const FEATURED_FACULTY_SLUGS = [
  "ravi",
  "kd",
  "swapnil",
  "apoorv",
  "tarun",
  "abhishek-gupta",
  "nikita",
  "sharwari",
  "sanchit",
  "neeraj",
  "brijesh",
  "shrikant",
  "himanshu",
  "divya",
  "kirti",
  "rupal",
  "ananya",
  "abhishek-dubey",
] as const;

export function getFeaturedFaculty(list: Faculty[] = faculty): Faculty[] {
  const bySlug = new Map(list.map((member) => [member.slug, member]));
  return FEATURED_FACULTY_SLUGS.map((slug) => bySlug.get(slug)).filter(
    (member): member is Faculty => Boolean(member?.featured)
  );
}

export function searchFaculty(list: Faculty[], query: string): Faculty[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return list;

  return list.filter((member) => {
    const haystack = [
      member.name,
      member.title,
      member.qualification,
      member.bio,
      ...member.specialization,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export interface FacultyFilterOptions {
  subject?: string;
  category?: string;
}

export function filterFaculty(list: Faculty[], filters: FacultyFilterOptions): Faculty[] {
  return list.filter((member) => {
    if (filters.category && !member.categories.includes(filters.category as CategoryId)) {
      return false;
    }

    if (filters.subject) {
      const subject = filters.subject.toLowerCase();
      const hasSubject = member.specialization.some(
        (spec) => spec.trim().toLowerCase() === subject
      );
      if (!hasSubject) return false;
    }

    return true;
  });
}

export function sortFaculty(list: Faculty[], sortKey: FacultySortKey): Faculty[] {
  const sorted = [...list];

  switch (sortKey) {
    case "experience-desc":
      return sorted.sort(
        (a, b) => parseExperienceYears(b.experience) - parseExperienceYears(a.experience)
      );
    case "experience-asc":
      return sorted.sort(
        (a, b) => parseExperienceYears(a.experience) - parseExperienceYears(b.experience)
      );
    case "rating-desc":
      return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sorted;
  }
}

export function getFacultyByCategory(categoryId: string): Faculty[] {
  return faculty.filter((f) =>
    f.categories.includes(categoryId as Faculty["categories"][number])
  );
}

/** MBA marquee faculty with cutout portraits from `rodha faculty profile`. */
export function getMbaStarFaculty(): Faculty[] {
  return faculty.filter(
    (f) =>
      f.categories.includes("cat") &&
      f.image.includes("rodha faculty profile")
  );
}

export function getFacultyBySlug(slug: string): Faculty | undefined {
  const member = faculty.find((f) => f.slug === slug);
  return member ? withFacultyDetailDefaults(member) : undefined;
}

const FEMALE_FIRST_NAMES = new Set([
  "Kriti",
  "Nikita",
  "Rupal",
  "Sharwari",
]);

const DEFAULT_RESULT_STATS: Record<CategoryId, FacultyResultStat[]> = {
  cat: [
    { id: "cat-p", value: "450+", label: "CAT", description: "99+%ile in CAT" },
    { id: "iim", value: "800+", label: "IIM Calls", description: "Documented IIM calls" },
    { id: "ipmat", value: "180+", label: "IPMAT", description: "IPMAT Top 100" },
    { id: "other", value: "350+", label: "B-School", description: "top B-school selections" },
  ],
  ipmat: [
    { id: "ipmat-top", value: "120+", label: "IPMAT", description: "Top 100 ranks" },
    { id: "iim-ipm", value: "200+", label: "IIM IPM", description: "IIM IPM selections" },
    { id: "other", value: "150+", label: "Integrated", description: "Other integrated program calls" },
    { id: "percentile", value: "95+", label: "Percentile", description: "95+ percentile outcomes" },
  ],
  clat: [
    { id: "clat-top", value: "80+", label: "CLAT", description: "Top NLU selections" },
    { id: "nlu", value: "150+", label: "NLU Calls", description: "National law university calls" },
    { id: "percentile", value: "120+", label: "Top Ranks", description: "All-India top ranks" },
    { id: "other", value: "90+", label: "Law Schools", description: "Other premier law schools" },
  ],
  ssc: [
    { id: "selections", value: "500+", label: "Selections", description: "Banking exam selections" },
    { id: "ibps", value: "300+", label: "IBPS", description: "IBPS PO/Clerk selections" },
    { id: "sbi", value: "180+", label: "SBI", description: "SBI PO/Clerk selections" },
    { id: "rrb", value: "120+", label: "RRB", description: "RRB exam selections" },
  ],
  skillhouse: [
    { id: "learners", value: "2,000+", label: "Learners", description: "Skill program completions" },
    { id: "placements", value: "85%", label: "Outcomes", description: "Career-ready outcomes" },
    { id: "projects", value: "50+", label: "Projects", description: "Hands-on capstone projects" },
    { id: "rating", value: "4.8", label: "Rating", description: "Average learner rating" },
  ],
};

function normalizeHeroStatIcons(stats: FacultyHeroStat[]): FacultyHeroStat[] {
  return stats.map((stat) => {
    let icon = stat.icon;
    if (icon.includes("top-faculty") || icon.includes("guidance")) icon = "experience";
    else if (icon.includes("users")) icon = "students";
    else if (icon.includes("result-oriented") || icon.includes("rank")) icon = "selections";
    return { ...stat, icon };
  });
}

/** Honorific label e.g. "Nishant Sir" or "Neha Ma'am" */
export function getFacultyHonorific(member: Faculty): string {
  const firstName = member.name.split(" ")[0].replace(/[()]/g, "");
  const suffix =
    member.honorificSuffix ??
    (FEMALE_FIRST_NAMES.has(firstName) ? "Ma'am" : "Sir");
  return `${firstName} ${suffix}`;
}

function defaultHeroStats(member: Faculty): FacultyHeroStat[] {
  const expYears = parseExperienceYears(member.experience);
  return [
    {
      id: "exp",
      value: expYears > 0 ? `${expYears}+` : member.experience.replace(/\s*Exp\.?$/i, ""),
      label: "Years of Experience",
      icon: "experience",
    },
  ];
}

function defaultResultStats(member: Faculty): FacultyResultStat[] {
  const cat = member.categories[0] ?? "cat";
  return DEFAULT_RESULT_STATS[cat] ?? DEFAULT_RESULT_STATS.cat;
}

/** Match tokens used when a testimonial names a faculty member */
function facultyNameTokens(member: Faculty): string[] {
  const tokens = new Set<string>();
  const parts = member.name
    .replace(/[()]/g, " ")
    .split(/\s+/)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (part.length >= 2) tokens.add(part.toLowerCase());
  }

  // Common aliases from testimonials
  if (member.slug === "kd" || member.name.includes("KD")) {
    tokens.add("kd");
  }
  if (member.slug === "swapnil") {
    tokens.add("swapnil");
    tokens.add("swapanil");
  }

  return Array.from(tokens);
}

const SUBJECT_ALIASES: Record<string, string[]> = {
  "quantitative aptitude": ["quant", "qa", "quantitative", "arithmetic", "algebra", "geometry"],
  lrdi: ["lrdi", "dilr", "lr di", "di lr", "logical reasoning", "data interpretation"],
  dilr: ["dilr", "lrdi", "logical reasoning", "data interpretation"],
  "logical reasoning": ["lr", "logical reasoning", "puzzles", "lrdi", "dilr"],
  "data interpretation": ["di", "data interpretation", "dilr", "lrdi"],
  "quantitative ability": ["quant", "qa", "quantitative"],
  varc: ["varc", "verbal", "rc", "reading comprehension", "va"],
  "verbal ability": ["varc", "verbal", "va", "vocabulary"],
  "verbal aptitude": ["varc", "verbal"],
  "reading comprehension": ["rc", "reading comprehension", "varc"],
  "critical reasoning": ["critical reasoning", "cr"],
  reasoning: ["reasoning", "lr"],
  "decision making": ["decision making"],
  "personal interview": ["gdpi", "pi", "interview"],
  "written ability test": ["wat", "gdpi"],
  algebra: ["algebra", "quant"],
  arrangements: ["arrangements", "lr", "puzzles"],
  caselets: ["caselets", "di", "dilr"],
};

const CATEGORY_KEYWORDS: Record<CategoryId, string[]> = {
  cat: ["cat", "mba", "iim", "gdpi", "xat", "nmat", "snap"],
  ipmat: ["ipmat", "ipm", "jipmat"],
  clat: ["clat", "nlu", "law", "ailet"],
  ssc: ["ssc", "banking", "ibps", "sbi", "rrb", "cgl"],
  skillhouse: ["skill house", "skillhouse", "excel", "ai "],
};

function testimonialMentionsFaculty(t: Testimonial, member: Faculty): boolean {
  const haystack = `${t.quote} ${t.exam} ${t.productCategory ?? ""}`.toLowerCase();
  const tokens = facultyNameTokens(member);

  for (const token of tokens) {
    // Prefer "ravi sir" / "kd sir" style, but also bare surname when distinctive
    if (haystack.includes(`${token} sir`) || haystack.includes(`${token} ma'am`) || haystack.includes(`${token} mam`)) {
      return true;
    }
    if (token.length >= 4 && new RegExp(`\\b${token}\\b`, "i").test(haystack)) {
      // Avoid matching common words; first names of 4+ chars when followed by faculty context
      if (haystack.includes("faculty") || haystack.includes("sir") || haystack.includes("ma'am") || haystack.includes("mam") || haystack.includes("mentor")) {
        return true;
      }
    }
  }
  return false;
}

function testimonialMentionsSubject(t: Testimonial, member: Faculty): boolean {
  const haystack = `${t.quote} ${t.exam} ${t.productCategory ?? ""}`.toLowerCase();
  let mentionedUnrelated = false;
  let mentionedRelated = false;

  const allKnownSubjects = Object.keys(SUBJECT_ALIASES);
  const memberSpecs = member.specialization.map((s) => s.trim().toLowerCase());

  for (const subjectKey of allKnownSubjects) {
    const aliases = SUBJECT_ALIASES[subjectKey] ?? [subjectKey];
    const hit = aliases.some((alias) => haystack.includes(alias));
    if (!hit) continue;

    const related = memberSpecs.some((spec) => {
      if (spec === subjectKey) return true;
      const specAliases = SUBJECT_ALIASES[spec] ?? [spec];
      return aliases.some((a) => specAliases.includes(a)) || spec.includes(subjectKey) || subjectKey.includes(spec);
    });

    if (related) mentionedRelated = true;
    else mentionedUnrelated = true;
  }

  // If a subject is named and none match this faculty, exclude
  if (mentionedUnrelated && !mentionedRelated) return false;
  return mentionedRelated;
}

function testimonialMatchesCategory(t: Testimonial, member: Faculty): boolean {
  const haystack = `${t.quote} ${t.exam} ${t.college} ${t.productCategory ?? ""} ${t.category}`.toLowerCase();

  // Landing testimonials use category "mba" for CAT
  const testimonialCategory: CategoryId | null =
    t.category === ("mba" as CategoryId) || (t.category as string) === "mba"
      ? "cat"
      : (["cat", "ipmat", "clat", "ssc", "skillhouse"].includes(t.category)
          ? (t.category as CategoryId)
          : null);

  if (testimonialCategory && member.categories.includes(testimonialCategory)) {
    // Still check explicit vertical keywords for unrelated mentions
  }

  let hitOther = false;
  let hitOwn = false;

  for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS) as [CategoryId, string[]][]) {
    const hit = keywords.some((kw) => haystack.includes(kw));
    if (!hit) continue;
    if (member.categories.includes(catId)) hitOwn = true;
    else hitOther = true;
  }

  if (hitOther && !hitOwn) return false;
  if (hitOwn) return true;

  if (testimonialCategory && member.categories.includes(testimonialCategory)) return true;
  return false;
}

/** Select up to 3 relevant category-landing testimonials for a faculty member. */
export function selectFacultyReviews(member: Faculty): FacultyReview[] {
  const allTestimonials = categoryLandings.flatMap((landing) => landing.testimonials);

  const nameMatches: Testimonial[] = [];
  const subjectMatches: Testimonial[] = [];
  const categoryMatches: Testimonial[] = [];

  for (const t of allTestimonials) {
    if (testimonialMentionsFaculty(t, member)) {
      nameMatches.push(t);
      continue;
    }

    const subjectOk = testimonialMentionsSubject(t, member);
    const categoryOk = testimonialMatchesCategory(t, member);

    // Explicit subject that doesn't match → skip
    const haystack = `${t.quote} ${t.exam} ${t.productCategory ?? ""}`.toLowerCase();
    const anySubjectNamed = Object.values(SUBJECT_ALIASES).some((aliases) =>
      aliases.some((a) => a.length >= 3 && haystack.includes(a))
    );
    if (anySubjectNamed && !subjectOk) continue;
    if (!categoryOk) continue;

    if (subjectOk) subjectMatches.push(t);
    else categoryMatches.push(t);
  }

  const picked: Testimonial[] = [];
  const seen = new Set<string>();

  for (const list of [nameMatches, subjectMatches, categoryMatches]) {
    for (const t of list) {
      if (picked.length >= 3) break;
      if (seen.has(t.id)) continue;
      seen.add(t.id);
      picked.push(t);
    }
    if (picked.length >= 3) break;
  }

  return picked.map((t, i) => ({
    id: `${member.id}-rev-${i}`,
    name: t.name,
    quote: t.quote,
    rating: 5,
    avatar:
      t.image && !t.image.includes("placeholders/")
        ? t.image
        : undefined,
  }));
}

/** Courses matched from faculty doc Graphy ids to existing category-landing cards. */
export function getCoursesForFaculty(member: Faculty): Course[] {
  const graphyIds = member.courseGraphyIds;
  // Explicit empty array = hide courses (e.g. Tarun — no usable links in doc)
  if (graphyIds !== undefined) {
    if (graphyIds.length === 0) return [];

    const courses: Course[] = [];
    const seen = new Set<string>();

    for (const landing of categoryLandings) {
      for (const course of landing.courses) {
        const url = `${course.enrollmentUrl ?? ""} ${course.externalLink ?? ""}`;
        const matches = graphyIds.some((id) => url.includes(id));
        if (!matches) continue;
        if (seen.has(course.id)) continue;
        seen.add(course.id);
        courses.push(course);
      }
    }

    return courses;
  }

  // Legacy fallback for profiles without authored courseGraphyIds
  const tokens = facultyNameTokens(member);
  const courses: Course[] = [];
  const seen = new Set<string>();

  for (const landing of categoryLandings) {
    for (const course of landing.courses) {
      if (!course.faculty) continue;
      const facultyLine = course.faculty.toLowerCase();
      const matches = tokens.some((token) => {
        if (token.length < 3) return false;
        return (
          facultyLine.includes(token) ||
          facultyLine.includes(`${token} sir`) ||
          facultyLine.includes(`${token} ma'am`) ||
          facultyLine.includes(`${token} mam`)
        );
      });
      if (!matches) continue;
      if (seen.has(course.id)) continue;
      seen.add(course.id);
      courses.push(course);
    }
  }

  return courses;
}

function defaultResultStatsForMember(member: Faculty): FacultyResultStat[] {
  return defaultResultStats(member);
}

/** Merge listing fields with non-fabricated detail defaults; authored fields win. */
export function withFacultyDetailDefaults(member: Faculty): Faculty {
  const honorific = getFacultyHonorific(member);
  const reviews = member.reviews ?? selectFacultyReviews(member);

  const merged: Faculty = {
    ...member,
    designation: member.designation ?? member.qualification,
    badgeLabel: member.badgeLabel ?? member.title,
    about:
      member.about ??
      `${member.bio}\n\n${honorific} brings ${member.experience} of expertise in ${member.specialization.slice(0, 3).join(", ") || member.title}.`,
    philosophy:
      member.philosophy ??
      `Every aspirant deserves clarity, structure, and mentorship that converts effort into results — that's the Rodha way with ${honorific}.`,
    expertiseTags: member.expertiseTags ?? [...member.specialization],
    reviewCountLabel:
      member.reviewCountLabel ??
      (member.studentsMentored ? `${member.studentsMentored} Students` : undefined),
    heroStats: normalizeHeroStatIcons(member.heroStats ?? defaultHeroStats(member)),
    // Only authored achievements — never fabricate
    achievements: member.achievements,
    // Courses come from category landings via getCoursesForFaculty in the section
    coursesTaught: member.coursesTaught,
    // Publications removed from UI — do not generate
    publications: undefined,
    reviews: reviews.length > 0 ? reviews : undefined,
    // Only authored videos — never fabricate
    videos: member.videos,
    resultStats: member.resultStats ?? defaultResultStatsForMember(member),
    cta: member.cta ?? {
      title: "Take the Next Step Towards Success",
      description:
        "Explore courses, book a free demo, or ask Rodha Buddy — your AI study companion.",
    },
  };

  return merged;
}
