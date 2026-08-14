import type {
  Faculty,
  FacultyCourseTaught,
  FacultyPublication,
  FacultyResultStat,
  FacultyReview,
  FacultyVideo,
  TeamHeroStat,
  ValueProp,
} from "@/lib/types";

const FACULTY_HERO_IMAGE = "/assets/images/faculty/listings page/hero-faulty.png";
export const FACULTY_DETAIL_DECORATION = FACULTY_HERO_IMAGE;
export const FACULTY_ACHIEVEMENT_IMAGE = "/assets/images/icons/rank.png";
export const FACULTY_RESULTS_PODIUM = "/assets/images/faculty/detail/results-podium.png";

/** Cutout portraits for MBA star faculty marquee */
const FACULTY_PROFILE_DIR = "/assets/images/faculty/rodha faculty profile";

export function facultyProfileImage(filename: string): string {
  return `${FACULTY_PROFILE_DIR}/${filename}`;
}

const BLOG_THUMB = "/assets/images/blog/hero-blog.png";
const COURSE_ICON = "/assets/icons/book.svg";
const VIDEO_THUMB = "/assets/images/placeholders/course-thumbnail.svg";

/** Official Rodha YouTube course / playlist links */
const YT_QUANT_PLAYLIST =
  "https://www.youtube.com/playlist?list=PLG4bwc5fquzgfMh4YFDnv7fttM0RIKiUQ";
const YT_LRDI_PLAYLIST =
  "https://www.youtube.com/playlist?list=PLG4bwc5fquzhDp8eqRym2Ma1ut10YF0Ea";
const YT_QUANT_FULL_COURSE = "https://www.youtube.com/watch?v=5O6ZnVoqwl4";
const YT_BOOSTER_COURSE = "https://www.youtube.com/watch?v=uc1CYyY_VnY";
const YT_CHANNEL = "https://youtube.com/@rodha";

function detailCourses(
  items: Array<Omit<FacultyCourseTaught, "icon"> & { icon?: string }>
): FacultyCourseTaught[] {
  return items.map((item) => ({
    icon: COURSE_ICON,
    ...item,
  }));
}

function detailPublications(
  items: Array<Omit<FacultyPublication, "thumbnail"> & { thumbnail?: string }>
): FacultyPublication[] {
  return items.map((item) => ({
    thumbnail: BLOG_THUMB,
    ...item,
  }));
}

function detailVideos(
  items: Array<Omit<FacultyVideo, "thumbnail"> & { thumbnail?: string }>
): FacultyVideo[] {
  return items.map((item) => ({
    thumbnail: VIDEO_THUMB,
    ...item,
  }));
}

const NISHANT_RESULT_STATS: FacultyResultStat[] = [
  { id: "cat-percentile", value: "650+", label: "99+%ile in CAT" },
  { id: "iim-calls", value: "1,100+", label: "IIM Calls" },
  { id: "ipmat-top", value: "250+", label: "IPMAT Top 100" },
  { id: "other-bschools", value: "500+", label: "Other Top B-school Selections" },
];

const SAMPLE_REVIEWS: FacultyReview[] = [
  {
    id: "rev-1",
    name: "Aarav Mehta",
    quote: "Concepts finally clicked. Went from 70%ile to 99.2%ile in Quant.",
    rating: 5,
    avatar: "/assets/images/profiles/male-2.png",
  },
  {
    id: "rev-2",
    name: "Priya Sharma",
    quote: "Best DI shortcuts I've seen. Mocks felt manageable after 8 weeks.",
    rating: 5,
    avatar: "/assets/images/profiles/female-1.png",
  },
  {
    id: "rev-3",
    name: "Rohan Kapoor",
    quote: "Patient, structured, and exam-focused. Highly recommend for QA.",
    rating: 5,
    avatar: "/assets/images/profiles/male-3.png",
  },
];

export const FACULTY_HERO = {
  titleBefore: "Meet Our Expert",
  titleHighlight: "Faculty",
  description:
    "Learn from India's top educators — experienced mentors and industry professionals who have guided thousands of aspirants to their dream colleges and careers.",
  image: FACULTY_HERO_IMAGE,
  imageAlt: "Graduation cap on books with diploma scroll",
};

export const FACULTY_HERO_STATS: TeamHeroStat[] = [
  {
    id: "expert-faculty",
    value: "100+",
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
    value: "50K+",
    label: "Students Mentored",
    icon: "/assets/icons/users.svg",
  },
  {
    id: "rating",
    value: "4.8/5",
    label: "Average Rating",
    icon: "/assets/icons/star.svg",
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

export const FACULTY_EXPERIENCE_BUCKETS = [
  { value: "", label: "All Experience" },
  { value: "5", label: "5+ Years" },
  { value: "10", label: "10+ Years" },
  { value: "15", label: "15+ Years" },
] as const;

export const faculty: Faculty[] = [
  {
    id: "faculty-nishant",
    name: "Nishant Agarwal",
    slug: "nishant-agarwal",
    title: "Quant & Aptitude Expert",
    designation: "Co-Founder, Rodha",
    badgeLabel: "Quant & Aptitude Expert",
    qualification: "IIM Ahmedabad, B.Tech IIT Delhi",
    specialization: [
      "Quantitative Aptitude",
      "Data Interpretation",
      "Logical Reasoning",
    ],
    experience: "18+ Years Exp.",
    bio: "Co-founder and Quant mentor who has guided thousands of aspirants to top B-school selections.",
    about:
      "Nishant Sir brings 18+ years of teaching excellence across CAT, IPMAT, and aptitude-heavy exams. Known for breaking Quant into intuitive frameworks, he has mentored 10,000+ students toward dream colleges.\n\nAs Co-Founder of Rodha, he shapes pedagogy that balances conceptual depth with exam speed — so every learner builds accuracy under pressure.",
    philosophy:
      "Make concepts so simple that speed becomes a by-product of clarity — not the other way around.",
    expertiseTags: [
      "Arithmetic",
      "Algebra",
      "Modern Math",
      "Geometry",
      "Number System",
      "Data Interpretation",
      "Logical Reasoning",
    ],
    image: "/assets/images/profiles/male-1.png",
    rating: 4.9,
    reviewCountLabel: "1,230+ Students",
    studentsMentored: "10,000+",
    heroStats: [
      {
        id: "exp",
        value: "18+",
        label: "Years of Experience",
        icon: "/assets/icons/top-faculty.svg",
      },
      {
        id: "mentored",
        value: "10,000+",
        label: "Students Mentored",
        icon: "/assets/icons/users.svg",
      },
      {
        id: "selections",
        value: "1,300+",
        label: "Selections",
        icon: "/assets/icons/result-oriented.svg",
      },
    ],
    achievements: [
      "18+ years mentoring CAT & IPMAT aspirants",
      "1,300+ documented selections across top B-schools",
      "Author of widely used Quant & DI practice series",
      "Former academic lead for national test-prep programs",
      "Regular speaker at campus strategy workshops",
      "Built Rodha's concept-first Quant curriculum",
    ],
    coursesTaught: detailCourses([
      {
        id: "nc-1",
        title: "MBA Foundation Course",
        subtitle: "For CAT 2025",
        lectures: "120+ Lectures",
        enrolled: "2,500+ Enrolled",
        href: YT_QUANT_FULL_COURSE,
      },
      {
        id: "nc-2",
        title: "Quant Mastery Program",
        subtitle: "For CAT 2025",
        lectures: "90+ Lectures",
        enrolled: "1,800+ Enrolled",
        href: YT_QUANT_PLAYLIST,
      },
      {
        id: "nc-3",
        title: "DI & LR Intensive",
        subtitle: "For CAT 2025",
        lectures: "75+ Lectures",
        enrolled: "1,400+ Enrolled",
        href: YT_LRDI_PLAYLIST,
      },
      {
        id: "nc-4",
        title: "IPMAT Quant Bootcamp",
        subtitle: "For IPMAT 2025",
        lectures: "60+ Lectures",
        enrolled: "900+ Enrolled",
        href: YT_BOOSTER_COURSE,
      },
    ]),
    publications: detailPublications([
      {
        id: "np-1",
        title: "The Ultimate Guide to Data Interpretation",
        meta: "Blog • Rodha • May 2024",
        href: "/blog",
      },
      {
        id: "np-2",
        title: "Arithmetic Shortcuts That Actually Stick",
        meta: "Blog • Rodha • March 2024",
        href: "/blog",
      },
      {
        id: "np-3",
        title: "How to Build Quant Accuracy Under Time Pressure",
        meta: "Video • Rodha • Jan 2024",
        href: "/blog",
      },
    ]),
    reviews: SAMPLE_REVIEWS,
    videos: detailVideos([
      {
        id: "nv-1",
        title: "Probability — Basics & Shortcuts",
        duration: "12:45",
      },
      {
        id: "nv-2",
        title: "Data Interpretation — Bar Graphs",
        duration: "15:20",
      },
      {
        id: "nv-3",
        title: "Number System — Remainders",
        duration: "10:08",
      },
    ]),
    resultStats: NISHANT_RESULT_STATS,
    categories: ["mba", "ipmat"],
    featured: true,
  },
  {
    id: "faculty-1",
    name: "Anand Mishra",
    slug: "anand-mishra",
    title: "QA Expert",
    designation: "Senior Quant Faculty, Rodha",
    badgeLabel: "Quant Aptitude Expert",
    qualification: "IIM Ahmedabad, B.Tech IIT Delhi",
    specialization: ["Quantitative Aptitude", "Data Interpretation", "Algebra"],
    experience: "15+ Years Exp.",
    bio: "Former IIM-A faculty with a passion for making Quant accessible to every aspirant.",
    about:
      "Anand Sir has spent 15+ years demystifying Quantitative Aptitude for CAT and IPMAT aspirants. His classroom style pairs rigorous foundations with high-yield practice sets.\n\nStudents value his calm pacing, crystal-clear board work, and relentless focus on accuracy before speed.",
    philosophy:
      "Master the why behind every formula — then speed becomes muscle memory, not guesswork.",
    expertiseTags: [
      "Arithmetic",
      "Algebra",
      "Geometry",
      "Number System",
      "Modern Math",
      "Data Interpretation",
      "Percentages",
    ],
    image: "/assets/images/faculty/anand-mishra.jpg",
    rating: 4.9,
    reviewCountLabel: "980+ Students",
    studentsMentored: "25K+",
    heroStats: [
      {
        id: "exp",
        value: "15+",
        label: "Years of Experience",
        icon: "/assets/icons/top-faculty.svg",
      },
      {
        id: "mentored",
        value: "25,000+",
        label: "Students Mentored",
        icon: "/assets/icons/users.svg",
      },
      {
        id: "selections",
        value: "900+",
        label: "Selections",
        icon: "/assets/icons/result-oriented.svg",
      },
    ],
    achievements: [
      "Mentored 5,000+ students to 95+ %ile Quant scores",
      "Author of QA guidebook used across Rodha cohorts",
      "Former IIM-A teaching associate for Quant workshops",
      "Designed Rodha's sectional Quant mock framework",
      "Speaker at national CAT strategy conclaves",
      "Consistent 4.9+ student rating across batches",
    ],
    coursesTaught: detailCourses([
      {
        id: "ac-1",
        title: "Quant Foundations",
        subtitle: "For CAT 2025",
        lectures: "100+ Lectures",
        enrolled: "3,200+ Enrolled",
        href: YT_QUANT_PLAYLIST,
      },
      {
        id: "ac-2",
        title: "Advanced Algebra Lab",
        subtitle: "For CAT 2025",
        lectures: "55+ Lectures",
        enrolled: "1,100+ Enrolled",
        href: YT_QUANT_FULL_COURSE,
      },
      {
        id: "ac-3",
        title: "DI Speed Builder",
        subtitle: "For CAT 2025",
        lectures: "40+ Lectures",
        enrolled: "1,500+ Enrolled",
        href: YT_LRDI_PLAYLIST,
      },
      {
        id: "ac-4",
        title: "IPMAT Quant Path",
        subtitle: "For IPMAT 2025",
        lectures: "50+ Lectures",
        enrolled: "700+ Enrolled",
        href: YT_BOOSTER_COURSE,
      },
    ]),
    publications: detailPublications([
      {
        id: "ap-1",
        title: "Algebra Mistakes That Cost Percentiles",
        meta: "Blog • Rodha • June 2024",
        href: "/blog",
      },
      {
        id: "ap-2",
        title: "Building a 90-Day Quant Revision Plan",
        meta: "Blog • Rodha • April 2024",
        href: "/blog",
      },
      {
        id: "ap-3",
        title: "Geometry in 20 High-Yield Patterns",
        meta: "Video • Rodha • Feb 2024",
        href: "/blog",
      },
    ]),
    reviews: [
      {
        id: "ar-1",
        name: "Sneha Reddy",
        quote: "Algebra finally feels logical. Jumped two percentile bands in 3 months.",
        rating: 5,
        avatar: "/assets/images/profiles/female-2.png",
      },
      {
        id: "ar-2",
        name: "Kunal Joshi",
        quote: "Clear explanations and ruthless practice sets. Exactly what I needed.",
        rating: 5,
        avatar: "/assets/images/profiles/male-4.png",
      },
      {
        id: "ar-3",
        name: "Ananya Iyer",
        quote: "Best Quant mentor I've had — patient and exam-aware.",
        rating: 5,
        avatar: "/assets/images/profiles/female-3.png",
      },
    ],
    videos: detailVideos([
      {
        id: "av-1",
        title: "Percentages — Core to Advanced",
        duration: "14:10",
      },
      {
        id: "av-2",
        title: "Quadratic Equations — Speed Methods",
        duration: "11:32",
      },
      {
        id: "av-3",
        title: "Time-Speed-Distance Frameworks",
        duration: "13:05",
      },
    ]),
    resultStats: [
      { id: "cat-p", value: "480+", label: "99+%ile in CAT" },
      { id: "iim", value: "820+", label: "IIM Calls" },
      { id: "ipmat", value: "180+", label: "IPMAT Top 100" },
      { id: "other", value: "350+", label: "Other Top B-school Selections" },
    ],
    categories: ["mba", "ipmat"],
    featured: true,
  },
  {
    id: "faculty-2",
    name: "Vishal Gupta",
    slug: "vishal-gupta",
    title: "VARC Specialist",
    qualification: "IIM Bangalore, MA English",
    specialization: ["Verbal Ability", "Reading Comprehension"],
    experience: "12+ Years Exp.",
    bio: "Specialist in building reading speed and comprehension accuracy for competitive exams.",
    image: "/assets/images/faculty/vishal-gupta.jpg",
    rating: 4.8,
    studentsMentored: "18K+",
    categories: ["mba"],
  },
  {
    id: "faculty-3",
    name: "Neha Agarwal",
    slug: "neha-agarwal",
    title: "DILR Strategist",
    designation: "Lead DILR Faculty, Rodha",
    badgeLabel: "DILR Strategy Expert",
    qualification: "IIM Calcutta, B.Tech IIT Bombay",
    specialization: [
      "Logical Reasoning",
      "Data Interpretation",
      "Puzzle Sets",
    ],
    experience: "10+ Years Exp.",
    bio: "Known for simplifying complex DI and LR sets with structured approaches.",
    about:
      "Neha Ma'am is Rodha's go-to mentor for Data Interpretation and Logical Reasoning. She turns chaotic sets into repeatable playbooks aspirants can trust on mock day.\n\nHer sessions emphasize set selection, time boxing, and clean scratch-work so accuracy survives the clock.",
    philosophy:
      "Choose the right set first — brilliance on the wrong puzzle still costs percentile.",
    expertiseTags: [
      "Arrangements",
      "Games & Tournaments",
      "Venn Diagrams",
      "Charts & Graphs",
      "Caselets",
      "Binary Logic",
      "Network Flows",
    ],
    image: "/assets/images/faculty/neha-agarwal.jpg",
    rating: 4.9,
    reviewCountLabel: "1,050+ Students",
    studentsMentored: "22K+",
    heroStats: [
      {
        id: "exp",
        value: "10+",
        label: "Years of Experience",
        icon: "/assets/icons/top-faculty.svg",
      },
      {
        id: "mentored",
        value: "22,000+",
        label: "Students Mentored",
        icon: "/assets/icons/users.svg",
      },
      {
        id: "selections",
        value: "750+",
        label: "Selections",
        icon: "/assets/icons/result-oriented.svg",
      },
    ],
    achievements: [
      "Coached 750+ students into top B-school shortlists",
      "Built Rodha's DILR set-selection framework",
      "IIM-C alumnus with deep mock analytics expertise",
      "Creator of weekly DILR battle-room sessions",
      "Featured mentor in national CAT webinars",
      "Average 4.9 rating across live cohorts",
    ],
    coursesTaught: detailCourses([
      {
        id: "nec-1",
        title: "DILR Masterclass",
        subtitle: "For CAT 2025",
        lectures: "85+ Lectures",
        enrolled: "2,100+ Enrolled",
        href: YT_LRDI_PLAYLIST,
      },
      {
        id: "nec-2",
        title: "LR Puzzle Lab",
        subtitle: "For CAT 2025",
        lectures: "48+ Lectures",
        enrolled: "1,300+ Enrolled",
        href: YT_LRDI_PLAYLIST,
      },
      {
        id: "nec-3",
        title: "DI Charts Intensive",
        subtitle: "For CAT 2025",
        lectures: "36+ Lectures",
        enrolled: "1,000+ Enrolled",
        href: YT_QUANT_FULL_COURSE,
      },
      {
        id: "nec-4",
        title: "IPMAT LR Accelerator",
        subtitle: "For IPMAT 2025",
        lectures: "42+ Lectures",
        enrolled: "650+ Enrolled",
        href: YT_CHANNEL,
      },
    ]),
    publications: detailPublications([
      {
        id: "nep-1",
        title: "How to Pick the Right DILR Set in 90 Seconds",
        meta: "Blog • Rodha • May 2024",
        href: "/blog",
      },
      {
        id: "nep-2",
        title: "Tournament Sets Without the Panic",
        meta: "Blog • Rodha • March 2024",
        href: "/blog",
      },
      {
        id: "nep-3",
        title: "Caselet DI — A Clean Scratch-Work Method",
        meta: "Video • Rodha • Jan 2024",
        href: "/blog",
      },
    ]),
    reviews: [
      {
        id: "nr-1",
        name: "Ishaan Patel",
        quote: "DILR used to scare me. Now I finish two solid sets every mock.",
        rating: 5,
        avatar: "/assets/images/profiles/male-5.png",
      },
      {
        id: "nr-2",
        name: "Meera Nair",
        quote: "Set selection advice alone was worth the entire course.",
        rating: 5,
        avatar: "/assets/images/profiles/female-4.png",
      },
      {
        id: "nr-3",
        name: "Kabir Singh",
        quote: "Structured, calm, and brutally practical. Loved every session.",
        rating: 5,
        avatar: "/assets/images/profiles/male-6.png",
      },
    ],
    videos: detailVideos([
      {
        id: "nev-1",
        title: "Arrangements — Linear & Circular",
        duration: "16:22",
      },
      {
        id: "nev-2",
        title: "Games & Tournaments Essentials",
        duration: "14:50",
      },
      {
        id: "nev-3",
        title: "Mixed Graph DI Walkthrough",
        duration: "12:18",
      },
    ]),
    resultStats: [
      { id: "cat-p", value: "520+", label: "99+%ile in CAT" },
      { id: "iim", value: "760+", label: "IIM Calls" },
      { id: "ipmat", value: "140+", label: "IPMAT Top 100" },
      { id: "other", value: "290+", label: "Other Top B-school Selections" },
    ],
    categories: ["mba", "ipmat"],
    featured: true,
  },
  {
    id: "faculty-4",
    name: "Rahul Sharma",
    slug: "rahul-sharma",
    title: "CAT Mentor",
    qualification: "IIM Indore IPM Alumnus",
    specialization: ["Quantitative Ability", "Verbal Ability"],
    experience: "8+ Years Exp.",
    bio: "CAT & IPMAT specialist focused on percentile improvement and exam temperament.",
    image: "/assets/images/faculty/rahul-sharma.jpg",
    rating: 4.7,
    studentsMentored: "12K+",
    categories: ["mba", "ipmat"],
  },
  {
    id: "faculty-5",
    name: "Megha Jivedi",
    slug: "megha-jivedi",
    title: "CLAT Legal Expert",
    qualification: "NLSIU Bangalore, LLM Oxford",
    specialization: ["Legal Reasoning", "Constitutional Law"],
    experience: "9+ Years Exp.",
    bio: "CLAT topper turned mentor, focused on demystifying legal reasoning for aspirants.",
    image: "/assets/images/faculty/megha-jivedi.jpg",
    rating: 4.8,
    studentsMentored: "9K+",
    categories: ["clat"],
    featured: true,
  },
  {
    id: "faculty-6",
    name: "Karan Malhotra",
    slug: "karan-malhotra",
    title: "GDPI Coach",
    qualification: "IIM Ahmedabad, Ex-MBB Consultant",
    specialization: ["Group Discussion", "Personal Interview"],
    experience: "11+ Years Exp.",
    bio: "Specialises in converting interview calls with structured GD frameworks and story-driven PIs.",
    image: "/assets/images/profiles/male-4.png",
    rating: 4.9,
    studentsMentored: "8K+",
    categories: ["mba"],
    featured: true,
  },
  {
    id: "faculty-7",
    name: "Sana Quereshi",
    slug: "sana-quereshi",
    title: "WAT & PI Mentor",
    qualification: "IIM Bangalore, BA Economics",
    specialization: ["Written Ability Test", "Communication"],
    experience: "8+ Years Exp.",
    bio: "Helps aspirants craft crisp WAT essays and authentic personal narratives for top B-schools.",
    image: "/assets/images/profiles/female-3.png",
    rating: 4.8,
    studentsMentored: "6K+",
    categories: ["mba"],
  },
  {
    id: "faculty-8",
    name: "Dev Kapoor",
    slug: "dev-kapoor",
    title: "CLAT GK Mentor",
    qualification: "NALSAR Hyderabad, BA LLB",
    specialization: ["Current Affairs", "Legal GK"],
    experience: "7+ Years Exp.",
    bio: "Builds daily CA habits and static GK frameworks that map directly to CLAT scoring patterns.",
    image: "/assets/images/profiles/male-5.png",
    rating: 4.7,
    studentsMentored: "7K+",
    categories: ["clat"],
  },
  {
    id: "faculty-9",
    name: "Riya Sen",
    slug: "riya-sen",
    title: "CLAT English Mentor",
    qualification: "NLU Delhi, MA Linguistics",
    specialization: ["English", "Reading Comprehension"],
    experience: "8+ Years Exp.",
    bio: "Trains aspirants to crush CLAT RC and grammar with speed techniques and passage maps.",
    image: "/assets/images/profiles/female-4.png",
    rating: 4.8,
    studentsMentored: "5K+",
    categories: ["clat"],
  },
  {
    id: "faculty-10",
    name: "Amit Bansal",
    slug: "amit-bansal",
    title: "CLAT Strategy Coach",
    qualification: "NLSIU Bangalore Alumnus",
    specialization: ["Exam Strategy", "Mock Analysis"],
    experience: "10+ Years Exp.",
    bio: "Specialises in mock diagnostics and NLU preference strategy for serious CLAT aspirants.",
    image: "/assets/images/profiles/male-6.png",
    rating: 4.9,
    studentsMentored: "11K+",
    categories: ["clat"],
    featured: true,
  },
  {
    id: "faculty-11",
    name: "Priya Nair",
    slug: "priya-nair",
    title: "GDPI Panel Expert",
    qualification: "IIM Calcutta, Ex-HR Lead",
    specialization: ["Group Discussion", "HR Interview"],
    experience: "9+ Years Exp.",
    bio: "Runs realistic GD panels and HR-style PIs that mirror top B-school interview rooms.",
    image: "/assets/images/profiles/female-1.png",
    rating: 4.8,
    studentsMentored: "5K+",
    categories: ["mba"],
  },
  {
    id: "faculty-12",
    name: "Rohan Deshmukh",
    slug: "rohan-deshmukh",
    title: "IPMAT Quant Mentor",
    qualification: "IIM Indore IPM, B.Sc Maths",
    specialization: ["Quantitative Ability", "Logical Reasoning"],
    experience: "6+ Years Exp.",
    bio: "Helps Class 11–12 aspirants build IPMAT Quant speed without sacrificing board prep.",
    image: "/assets/images/profiles/male-4.png",
    rating: 4.7,
    studentsMentored: "4K+",
    categories: ["ipmat"],
  },
  {
    id: "faculty-13",
    name: "Aditya Khanna",
    slug: "aditya-khanna",
    title: "Case Discussion Coach",
    qualification: "IIM Lucknow, Ex-Strategy Consultant",
    specialization: ["Case Study", "Group Discussion"],
    experience: "7+ Years Exp.",
    bio: "Trains shortlisted candidates on case frameworks and collaborative GD dynamics for IIM calls.",
    image: "/assets/images/profiles/male-1.png",
    rating: 4.8,
    studentsMentored: "4K+",
    categories: ["mba"],
  },
  {
    id: "faculty-banking-1",
    name: "Rahul Verma",
    slug: "rahul-verma",
    title: "Banking Quant Expert",
    qualification: "Ex-IBPS Faculty, B.Tech",
    specialization: ["Quantitative Aptitude", "Data Interpretation"],
    experience: "10+ Years Exp.",
    bio: "Specialises in banking Quant patterns for IBPS, SBI and RBI aspirants.",
    image: "/assets/images/profiles/male-3.png",
    rating: 4.8,
    studentsMentored: "8K+",
    categories: ["banking"],
    featured: true,
  },
  {
    id: "faculty-banking-2",
    name: "Neha Kapoor",
    slug: "neha-kapoor",
    title: "Reasoning & SSC Mentor",
    qualification: "M.Sc Mathematics",
    specialization: ["Reasoning", "SSC Strategy"],
    experience: "9+ Years Exp.",
    bio: "Guides SSC and banking aspirants through reasoning frameworks and speed drills.",
    image: "/assets/images/profiles/female-2.png",
    rating: 4.7,
    studentsMentored: "6K+",
    categories: ["banking"],
  },
  {
    id: "faculty-skill-1",
    name: "Aisha Khan",
    slug: "aisha-khan",
    title: "Communication Coach",
    qualification: "MA Communication",
    specialization: ["Professional Communication", "Interviews"],
    experience: "8+ Years Exp.",
    bio: "Helps learners build presentation, interview and workplace communication skills.",
    image: "/assets/images/profiles/female-4.png",
    rating: 4.9,
    studentsMentored: "5K+",
    categories: ["skillhouse"],
  },
  {
    id: "faculty-skill-2",
    name: "Dev Sharma",
    slug: "dev-sharma",
    title: "Leadership Mentor",
    qualification: "MBA, IIM",
    specialization: ["Leadership", "Personal Branding"],
    experience: "11+ Years Exp.",
    bio: "Mentors early professionals on leadership essentials and career storytelling.",
    image: "/assets/images/profiles/male-6.png",
    rating: 4.8,
    studentsMentored: "4K+",
    categories: ["skillhouse"],
  },
  // --- Rodha faculty profile cutouts (MBA star faculty marquee) ---
  {
    id: "faculty-profile-ravi",
    name: "Ravi",
    slug: "ravi",
    title: "Quant Faculty",
    qualification: "CAT Quant Mentor",
    specialization: ["Quantitative Aptitude", "Arithmetic"],
    experience: "12+ Years Exp.",
    bio: "Known for high-speed Quant frameworks and R8 fast-paced batch mentoring.",
    image: facultyProfileImage("Ravi Sir.png"),
    rating: 4.9,
    studentsMentored: "15K+",
    categories: ["mba"],
    featured: true,
  },
  {
    id: "faculty-profile-kd",
    name: "KD",
    slug: "kd",
    title: "Quant & Test Series Mentor",
    qualification: "CAT Strategy Mentor",
    specialization: ["Quantitative Aptitude", "Mock Analysis"],
    experience: "14+ Years Exp.",
    bio: "Guides aspirants through weekly live sessions and percentile-focused mock reviews.",
    image: facultyProfileImage("KD Sir.png"),
    rating: 4.9,
    studentsMentored: "14K+",
    categories: ["mba"],
    featured: true,
  },
  {
    id: "faculty-profile-apoorv",
    name: "Apoorv",
    slug: "apoorv",
    title: "DILR Faculty",
    qualification: "CAT DILR Mentor",
    specialization: ["Data Interpretation", "Logical Reasoning"],
    experience: "10+ Years Exp.",
    bio: "Co-leads Zero to Zenith DILR fast-paced batches with set-selection mastery.",
    image: facultyProfileImage("Appoorv Sir.png"),
    rating: 4.8,
    studentsMentored: "12K+",
    categories: ["mba"],
    featured: true,
  },
  {
    id: "faculty-profile-brijesh",
    name: "Brijesh",
    slug: "brijesh",
    title: "VARC Faculty",
    qualification: "CAT Verbal Mentor",
    specialization: ["Verbal Ability", "Reading Comprehension"],
    experience: "11+ Years Exp.",
    bio: "Builds reading stamina and RC accuracy for serious CAT aspirants.",
    image: facultyProfileImage("Brijesh Sir.png"),
    rating: 4.8,
    studentsMentored: "10K+",
    categories: ["mba"],
    featured: true,
  },
  {
    id: "faculty-profile-himanshu",
    name: "Himanshu",
    slug: "himanshu",
    title: "Quant Faculty",
    qualification: "CAT Quant Mentor",
    specialization: ["Quantitative Aptitude", "Algebra"],
    experience: "9+ Years Exp.",
    bio: "Concept-first Quant mentor focused on accuracy under timed pressure.",
    image: facultyProfileImage("Himanshu Sir.png"),
    rating: 4.8,
    studentsMentored: "9K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-neeraj",
    name: "Neeraj",
    slug: "neeraj",
    title: "DILR Faculty",
    qualification: "CAT DILR Mentor",
    specialization: ["Logical Reasoning", "Puzzles"],
    experience: "10+ Years Exp.",
    bio: "Turns complex LR sets into repeatable playbooks for mock day.",
    image: facultyProfileImage("Neeraj Sir.png"),
    rating: 4.8,
    studentsMentored: "8K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-sanchit",
    name: "Sanchit",
    slug: "sanchit",
    title: "Quant Faculty",
    qualification: "CAT Quant Mentor",
    specialization: ["Quantitative Aptitude", "Geometry"],
    experience: "8+ Years Exp.",
    bio: "Helps aspirants convert weak Quant topics into scoring strengths.",
    image: facultyProfileImage("Sanchit Sir.png"),
    rating: 4.7,
    studentsMentored: "7K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-shrikant",
    name: "Shrikant",
    slug: "shrikant",
    title: "VARC Faculty",
    qualification: "CAT Verbal Mentor",
    specialization: ["Verbal Ability", "Grammar"],
    experience: "9+ Years Exp.",
    bio: "Trains aspirants on VA accuracy and passage mapping for CAT RC.",
    image: facultyProfileImage("Shrikant Sir.png"),
    rating: 4.8,
    studentsMentored: "8K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-swapnil",
    name: "Swapnil",
    slug: "swapnil",
    title: "GDPI Faculty",
    qualification: "B-School Interview Mentor",
    specialization: ["Group Discussion", "Personal Interview"],
    experience: "8+ Years Exp.",
    bio: "Prepares shortlisted candidates for GDPI conversions at top B-schools.",
    image: facultyProfileImage("Swapanil Sir.png"),
    rating: 4.8,
    studentsMentored: "6K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-tarun",
    name: "Tarun",
    slug: "tarun",
    title: "CAT Mentor",
    qualification: "CAT Strategy Mentor",
    specialization: ["Exam Strategy", "Mock Analysis"],
    experience: "10+ Years Exp.",
    bio: "Focuses on mock diagnostics and percentile improvement plans.",
    image: facultyProfileImage("Tarun Sir.png"),
    rating: 4.8,
    studentsMentored: "9K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-abhishek-gupta",
    name: "Abhishek Gupta",
    slug: "abhishek-gupta",
    title: "Quant Faculty",
    qualification: "CAT Quant Mentor",
    specialization: ["Quantitative Aptitude", "Number System"],
    experience: "11+ Years Exp.",
    bio: "Known for clear board work and high-yield Quant practice sets.",
    image: facultyProfileImage("Abhishek Gupta Sir.png"),
    rating: 4.9,
    studentsMentored: "11K+",
    categories: ["mba"],
    featured: true,
  },
  {
    id: "faculty-profile-abhishek-dubey",
    name: "Abhishek Dubey",
    slug: "abhishek-dubey",
    title: "DILR Faculty",
    qualification: "CAT DILR Mentor",
    specialization: ["Data Interpretation", "Caselets"],
    experience: "9+ Years Exp.",
    bio: "Specialises in DI charts and caselet frameworks for CAT.",
    image: facultyProfileImage("Abhishek Dubey.png"),
    rating: 4.8,
    studentsMentored: "8K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-ananya",
    name: "Ananya",
    slug: "ananya",
    title: "VARC Faculty",
    qualification: "CAT Verbal Mentor",
    specialization: ["Reading Comprehension", "Verbal Ability"],
    experience: "7+ Years Exp.",
    bio: "Helps aspirants build RC speed without losing comprehension depth.",
    image: facultyProfileImage("Ananya.png"),
    rating: 4.8,
    studentsMentored: "6K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-divya",
    name: "Divya",
    slug: "divya",
    title: "VARC Faculty",
    qualification: "CAT Verbal Mentor",
    specialization: ["Verbal Ability", "Reading Comprehension"],
    experience: "8+ Years Exp.",
    bio: "Mentors aspirants on VA fundamentals and timed RC drills.",
    image: facultyProfileImage("Divya.png"),
    rating: 4.8,
    studentsMentored: "7K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-kirti",
    name: "Kirti",
    slug: "kirti",
    title: "DILR Faculty",
    qualification: "CAT DILR Mentor",
    specialization: ["Logical Reasoning", "Arrangements"],
    experience: "7+ Years Exp.",
    bio: "Builds structured scratch-work habits for DILR accuracy.",
    image: facultyProfileImage("Kirti.png"),
    rating: 4.7,
    studentsMentored: "5K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-nikita",
    name: "Nikita",
    slug: "nikita",
    title: "VARC Faculty",
    qualification: "CAT Verbal Mentor",
    specialization: ["Verbal Ability", "Communication"],
    experience: "8+ Years Exp.",
    bio: "Trains aspirants on crisp verbal strategy and WAT foundations.",
    image: facultyProfileImage("Nikita Mam.png"),
    rating: 4.8,
    studentsMentored: "6K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-rupal",
    name: "Rupal",
    slug: "rupal",
    title: "GDPI Faculty",
    qualification: "B-School Interview Mentor",
    specialization: ["Personal Interview", "Written Ability Test"],
    experience: "7+ Years Exp.",
    bio: "Helps aspirants craft authentic PI narratives for IIM calls.",
    image: facultyProfileImage("Rupal.png"),
    rating: 4.8,
    studentsMentored: "5K+",
    categories: ["mba"],
  },
  {
    id: "faculty-profile-sharwari",
    name: "Sharwari",
    slug: "sharwari",
    title: "VARC Faculty",
    qualification: "CAT Verbal Mentor",
    specialization: ["Reading Comprehension", "Verbal Ability"],
    experience: "6+ Years Exp.",
    bio: "Focuses on RC mapping techniques and VA accuracy drills.",
    image: facultyProfileImage("Sharwari Mam.png"),
    rating: 4.7,
    studentsMentored: "4K+",
    categories: ["mba"],
  },
];

function getUniqueSubjects(list: Faculty[]): string[] {
  const subjects = new Set<string>();
  for (const member of list) {
    for (const spec of member.specialization) {
      subjects.add(spec);
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

export function getFeaturedFaculty(list: Faculty[] = faculty): Faculty[] {
  return list.filter((f) => f.featured);
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
  experience?: string;
}

export function filterFaculty(list: Faculty[], filters: FacultyFilterOptions): Faculty[] {
  return list.filter((member) => {
    if (filters.subject && !member.specialization.includes(filters.subject)) {
      return false;
    }

    if (filters.experience) {
      const minYears = parseInt(filters.experience, 10);
      if (parseExperienceYears(member.experience) < minYears) {
        return false;
      }
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
      f.categories.includes("mba") &&
      f.image.includes("rodha faculty profile")
  );
}

export function getFacultyBySlug(slug: string): Faculty | undefined {
  return faculty.find((f) => f.slug === slug);
}
