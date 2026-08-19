import type { BlogPost } from "@/lib/types";

// ---------------------------------------------------------------------------
// Blog categories
// ---------------------------------------------------------------------------

export interface BlogCategory {
  id: string;
  label: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: "all", label: "All" },
  { id: "mba-cat", label: "MBA" },
  { id: "ipmat", label: "IPMAT" },
  { id: "clat", label: "CLAT" },
  { id: "banking", label: "Banking" },
  { id: "study-tips", label: "Study Tips" },
  { id: "career-guidance", label: "Career Guidance" },
  { id: "exam-updates", label: "Exam Updates" },
];

export const BLOG_ITEMS_PER_PAGE = 8;

// ---------------------------------------------------------------------------
// Blog content helper — minimal trusted HTML for static posts
// ---------------------------------------------------------------------------

function p(text: string) {
  return `<p>${text}</p>`;
}

const getThumbnail = (slug: string) => `/assets/images/blog/${slug}.png`;
const PLACEHOLDER = "/assets/images/placeholders/blog-thumbnail.svg";

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    slug: "cat-2026-exam-pattern-complete-guide",
    title: "CAT 2026 Exam Pattern: Complete Guide to Syllabus, Sections & Scoring",
    category: "mba-cat",
    thumbnail: getThumbnail("blog-1"),
    shortDescription:
      "Everything you need to know about the CAT 2026 exam pattern, section-wise syllabus, marking scheme, and preparation strategy.",
    content: `
      <h2>Understanding the CAT 2026 Exam Structure</h2>
      ${p("The Common Admission Test (CAT) 2026 continues with three sections — Verbal Ability & Reading Comprehension (VARC), Data Interpretation & Logical Reasoning (DILR), and Quantitative Ability (QA). Each section carries equal weight and is timed separately at 40 minutes.")}
      <h3>Section-wise Breakdown</h3>
      <ul>
        <li><strong>VARC:</strong> 24 questions — RC passages, para-jumbles, summary, and odd-sentence-out.</li>
        <li><strong>DILR:</strong> 20 questions — data sets, caselets, arrangements, and puzzles.</li>
        <li><strong>QA:</strong> 22 questions — arithmetic, algebra, geometry, number systems, and modern maths.</li>
      </ul>
      <h3>Marking Scheme</h3>
      ${p("MCQs carry +3 for correct and −1 for incorrect answers. TITA (Type In The Answer) questions have no negative marking. A strategic approach to attempt selection is crucial for maximising your score.")}
      <h3>Preparation Strategy</h3>
      <ol>
        <li>Begin with concept clarity — cover fundamentals of each section before mock practice.</li>
        <li>Take at least 30 full-length mocks in the last 3 months.</li>
        <li>Analyse every mock — <em>time per question</em> and <em>accuracy by topic</em> matter more than raw scores.</li>
      </ol>
      ${p("With consistent practice and the right mentorship, a <strong>99+ percentile</strong> is absolutely achievable. <a href='/category/cat'>Explore Rodha's CAT programs</a> to get started.")}
    `,
    publishedDate: "2026-06-15",
    readTime: "8 min read",
    metaTitle: "CAT 2026 Exam Pattern — Syllabus, Sections & Scoring | Rodha",
    metaDescription:
      "Complete guide to CAT 2026 exam pattern including section-wise syllabus, marking scheme, and preparation strategies from Rodha's expert faculty.",
    metaKeywords: ["CAT 2026", "CAT exam pattern", "CAT syllabus", "CAT preparation"],
    tags: ["CAT", "Exam Pattern", "Syllabus"],
    featured: true,
    // legacy compat
    excerpt:
      "Everything you need to know about the CAT 2026 exam pattern, section-wise syllabus, marking scheme, and preparation strategy.",
    image: getThumbnail("blog-1"),
    publishedAt: "2026-06-15",
    author: "Rodha Team",
  },
  {
    id: "b2",
    slug: "crack-ipmat-2026-in-6-months",
    title: "How to Crack IPMAT 2026 in 6 Months: A Proven Strategy",
    category: "ipmat",
    thumbnail: getThumbnail("blog-3"),
    shortDescription:
      "A month-by-month preparation plan to crack IPMAT and secure admission to IIM Indore or Rohtak.",
    content: `
      <h2>Your 6-Month IPMAT Roadmap</h2>
      ${p("IPMAT (Integrated Programme in Management Aptitude Test) is the gateway to 5-year integrated management programmes at IIM Indore and IIM Rohtak. With the right strategy, six months is more than enough to prepare.")}
      <h3>Month 1–2: Foundation Building</h3>
      ${p("Focus on strengthening quantitative aptitude fundamentals — arithmetic, algebra, and geometry. For the verbal section, begin with reading comprehension and vocabulary building.")}
      <h3>Month 3–4: Advanced Topics & Practice</h3>
      ${p("Move to advanced problem-solving, probability, permutations, and set theory. Practice at least 50 RC passages and start timed sectional tests.")}
      <h3>Month 5–6: Mocks & Revision</h3>
      ${p("Take 2–3 full-length IPMAT mocks per week. Analyse mistakes, revise weak areas, and maintain an error log.")}
      ${p("<a href='/category/ipmat'>Explore Rodha's IPMAT programs</a> for structured preparation with expert mentors.")}
    `,
    publishedDate: "2026-06-10",
    readTime: "6 min read",
    metaTitle: "Crack IPMAT 2026 in 6 Months — Preparation Strategy | Rodha",
    metaDescription:
      "Month-by-month IPMAT 2026 preparation plan covering quantitative aptitude, verbal ability, and mock test strategy.",
    metaKeywords: ["IPMAT 2026", "IPMAT preparation", "IIM Indore", "IPMAT strategy"],
    tags: ["IPMAT", "Strategy"],
    excerpt: "A month-by-month preparation plan to crack IPMAT and secure admission to IIM Indore or Rohtak.",
    image: getThumbnail("blog-3"),
    publishedAt: "2026-06-10",
    author: "Rodha Team",
  },
  {
    id: "b3",
    slug: "clat-2026-legal-reasoning-tips",
    title: "CLAT 2026 Legal Reasoning: Key Topics & Practice Tips",
    category: "clat",
    thumbnail: getThumbnail("blog-4"),
    shortDescription:
      "Focus on the most important legal reasoning topics and practice strategies for CLAT 2026.",
    content: `
      <h2>Mastering Legal Reasoning for CLAT</h2>
      ${p("Legal reasoning is one of the five sections in CLAT and carries significant weight. The section tests your ability to apply legal principles to factual situations.")}
      <h3>Key Topics</h3>
      <ul>
        <li>Constitutional law principles</li>
        <li>Contract law basics</li>
        <li>Criminal law fundamentals</li>
        <li>Tort law and liability</li>
        <li>Legal maxims and their applications</li>
      </ul>
      <h3>Practice Tips</h3>
      <ol>
        <li>Read legal passages daily — start with 2 and increase to 5 per day.</li>
        <li>Understand the principle-fact-decision framework used in most questions.</li>
        <li>Practice previous year CLAT papers section-wise.</li>
      </ol>
      ${p("<a href='/category/clat'>Explore Rodha's CLAT programs</a> for comprehensive legal reasoning preparation.")}
    `,
    publishedDate: "2026-05-28",
    readTime: "7 min read",
    metaTitle: "CLAT 2026 Legal Reasoning Tips — Key Topics & Practice | Rodha",
    metaDescription:
      "Essential legal reasoning topics and practice strategies for CLAT 2026 from Rodha's law preparation experts.",
    metaKeywords: ["CLAT 2026", "legal reasoning", "CLAT preparation", "law entrance"],
    tags: ["CLAT", "Legal Reasoning"],
    excerpt: "Focus on the most important legal reasoning topics and practice strategies for CLAT 2026.",
    image: getThumbnail("blog-4"),
    publishedAt: "2026-05-28",
    author: "Rodha Team",
  },
  {
    id: "b4",
    slug: "study-habits-cat-99-percentilers",
    title: "10 Proven Study Habits of CAT 99 Percentilers",
    category: "study-tips",
    thumbnail: getThumbnail("blog-1"),
    shortDescription:
      "Learn the daily routines, revision tactics, and mock-test strategies that top scorers swear by.",
    content: `
      <h2>What Sets 99 Percentilers Apart?</h2>
      ${p("Scoring above the 99th percentile in CAT isn't just about talent — it's about disciplined habits. Here are ten habits consistently followed by top scorers.")}
      <ol>
        <li><strong>Early morning study blocks</strong> — Most toppers study 2–3 hours before the day begins.</li>
        <li><strong>Concept-first approach</strong> — They master fundamentals before attempting advanced problems.</li>
        <li><strong>Daily reading habit</strong> — At least 30 minutes of editorial/opinion reading for VARC.</li>
        <li><strong>Mock analysis > Mock attempts</strong> — They spend more time analysing than taking mocks.</li>
        <li><strong>Error logs</strong> — Maintaining a record of mistakes and revisiting them weekly.</li>
        <li><strong>Timed practice</strong> — Every practice session is timed, never open-ended.</li>
        <li><strong>Peer discussion groups</strong> — Explaining concepts to others strengthens understanding.</li>
        <li><strong>Selective social media</strong> — Limiting distractions during preparation months.</li>
        <li><strong>Physical fitness</strong> — Regular exercise to maintain energy and focus.</li>
        <li><strong>Consistent sleep schedule</strong> — 7–8 hours of quality sleep, non-negotiable.</li>
      </ol>
      ${p("Build these habits into your routine and watch your scores climb. <a href='/category/cat'>Start with Rodha's guided CAT preparation</a>.")}
    `,
    publishedDate: "2026-05-20",
    readTime: "4 min read",
    metaTitle: "10 Study Habits of CAT 99 Percentilers | Rodha",
    metaDescription:
      "Discover the daily routines, revision tactics, and strategies used by CAT 99+ percentilers.",
    metaKeywords: ["CAT preparation", "study habits", "99 percentile", "CAT tips"],
    tags: ["CAT", "Study Tips"],
    excerpt: "Learn the daily routines, revision tactics, and mock-test strategies that top scorers swear by.",
    image: getThumbnail("blog-1"),
    publishedAt: "2026-05-20",
    author: "Rodha Team",
  },
  {
    id: "b5",
    slug: "banking-exams-2026-complete-guide",
    title: "Banking Exams 2026: Complete Guide to Succeed",
    category: "banking",
    thumbnail: getThumbnail("blog-4"),
    shortDescription:
      "A comprehensive overview of banking exams in 2026 including IBPS PO, SBI PO, RBI Grade B, and effective preparation strategies.",
    content: `
      <h2>Overview of Major Banking Exams in 2026</h2>
      ${p("Banking exams remain one of the most sought-after competitive exam categories in India. With lakhs of aspirants appearing each year, a structured approach is essential.")}
      <h3>Key Exams</h3>
      <ul>
        <li><strong>IBPS PO:</strong> Preliminary + Mains + Interview for Probationary Officer posts.</li>
        <li><strong>SBI PO:</strong> India's largest bank — highly competitive with three stages.</li>
        <li><strong>RBI Grade B:</strong> Premium government role with a comprehensive exam pattern.</li>
        <li><strong>IBPS Clerk:</strong> Entry-level banking role with massive recruitment numbers.</li>
      </ul>
      <h3>Preparation Strategy</h3>
      ${p("Start with quantitative aptitude and reasoning ability — these sections overlap across exams. Build English language skills through daily reading and grammar practice.")}
      ${p("<a href='/category/banking'>Explore Rodha's Banking exam programs</a> for expert-led preparation.")}
    `,
    publishedDate: "2026-05-14",
    readTime: "6 min read",
    metaTitle: "Banking Exams 2026 — Complete Guide | Rodha",
    metaDescription:
      "Complete guide to banking exams in 2026 — IBPS PO, SBI PO, RBI Grade B preparation strategies and tips.",
    metaKeywords: ["banking exams 2026", "IBPS PO", "SBI PO", "RBI Grade B"],
    tags: ["Banking", "Exam Guide"],
    excerpt: "A comprehensive overview of banking exams in 2026.",
    image: getThumbnail("blog-4"),
    publishedAt: "2026-05-14",
    author: "Rodha Team",
  },
  {
    id: "b6",
    slug: "mba-after-graduation-career-opportunities",
    title: "MBA After Graduation: Career Opportunities Explained",
    category: "career-guidance",
    thumbnail: getThumbnail("blog-1"),
    shortDescription:
      "Explore the diverse career paths an MBA opens up — from consulting and finance to entrepreneurship and tech management.",
    content: `
      <h2>Why an MBA After Graduation?</h2>
      ${p("An MBA is one of the most versatile postgraduate degrees. It equips you with management fundamentals, leadership skills, and an extensive professional network.")}
      <h3>Top Career Paths After MBA</h3>
      <ul>
        <li><strong>Management Consulting:</strong> McKinsey, BCG, Bain — top B-school grads are heavily recruited.</li>
        <li><strong>Investment Banking & Finance:</strong> Roles at Goldman Sachs, JP Morgan, and domestic banks.</li>
        <li><strong>Product Management:</strong> Tech companies like Google, Amazon, and startups actively hire MBAs.</li>
        <li><strong>Entrepreneurship:</strong> The structured thinking and network make MBA founders successful.</li>
        <li><strong>Marketing & Brand Management:</strong> FMCG giants like HUL, P&G, and Nestlé.</li>
      </ul>
      ${p("Your career trajectory depends on the B-school, specialisation, and internship experience. <a href='/category/cat'>Start your MBA journey with Rodha</a>.")}
    `,
    publishedDate: "2026-05-10",
    readTime: "5 min read",
    metaTitle: "MBA After Graduation — Career Opportunities | Rodha",
    metaDescription:
      "Discover career paths after MBA — consulting, finance, product management, entrepreneurship and more.",
    metaKeywords: ["MBA career", "MBA after graduation", "career opportunities"],
    tags: ["Career Guidance", "MBA"],
    excerpt: "Explore the diverse career paths an MBA opens up.",
    image: getThumbnail("blog-1"),
    publishedAt: "2026-05-10",
    author: "Rodha Team",
  },
  {
    id: "b7",
    slug: "important-exams-2026-dates-eligibility",
    title: "Important Exams in 2026: Dates, Eligibility & Syllabus",
    category: "exam-updates",
    thumbnail: getThumbnail("blog-4"),
    shortDescription:
      "Stay updated with key exam dates, eligibility criteria, and syllabus changes for all major competitive exams in 2026.",
    content: `
      <h2>2026 Exam Calendar at a Glance</h2>
      ${p("Staying on top of exam dates and eligibility changes is crucial for aspirants juggling multiple exams. Here's a consolidated view of the major exams in 2026.")}
      <h3>MBA Entrance Exams</h3>
      <ul>
        <li><strong>CAT 2026:</strong> Expected in November. Eligibility — graduation with 50% aggregate.</li>
        <li><strong>XAT 2027:</strong> January 2027 — register by November 2026.</li>
        <li><strong>SNAP 2026:</strong> December — multiple test windows.</li>
      </ul>
      <h3>Law Entrance Exams</h3>
      <ul>
        <li><strong>CLAT 2026:</strong> December — for 5-year and 1-year LLB programmes.</li>
        <li><strong>AILET 2026:</strong> Separate exam for NLU Delhi.</li>
      </ul>
      <h3>Banking Exams</h3>
      <ul>
        <li><strong>IBPS PO 2026:</strong> Prelims in October, Mains in November.</li>
        <li><strong>SBI PO 2026:</strong> Notification expected by April.</li>
      </ul>
      ${p("Bookmark this page and check back for updates as official notifications are released.")}
    `,
    publishedDate: "2026-05-06",
    readTime: "5 min read",
    metaTitle: "Important Exams 2026 — Dates, Eligibility & Syllabus | Rodha",
    metaDescription:
      "Key exam dates, eligibility, and syllabus updates for CAT, CLAT, IPMAT, banking, and other competitive exams in 2026.",
    metaKeywords: ["exam dates 2026", "CAT 2026 date", "CLAT 2026", "IBPS PO 2026"],
    tags: ["Exam Updates", "Calendar"],
    excerpt: "Stay updated with key exam dates for 2026.",
    image: getThumbnail("blog-4"),
    publishedAt: "2026-05-06",
    author: "Rodha Team",
  },
  {
    id: "b8",
    slug: "time-management-tips-exam-preparation",
    title: "Time Management Tips for Exam Preparation",
    category: "study-tips",
    thumbnail: getThumbnail("blog-1"),
    shortDescription:
      "Master the art of managing your study time effectively with techniques proven by top rankers.",
    content: `
      <h2>Why Time Management Matters</h2>
      ${p("Most aspirants don't fail because of lack of intelligence — they fail because of poor time management. Here's how to structure your day for maximum productivity.")}
      <h3>The Pomodoro Technique for Exam Prep</h3>
      ${p("Study in focused 25-minute blocks with 5-minute breaks. After four blocks, take a longer 15–20 minute break. This keeps your mind fresh and prevents burnout.")}
      <h3>Create a Weekly Study Plan</h3>
      <ol>
        <li>Allocate specific subjects to specific days.</li>
        <li>Reserve 2 days per week exclusively for revision and mock tests.</li>
        <li>Keep one day lighter for rest and informal learning (podcasts, articles).</li>
      </ol>
      <h3>Avoid Common Time Wasters</h3>
      <ul>
        <li>Endless note-making without practice</li>
        <li>Switching between too many resources</li>
        <li>Over-planning without execution</li>
      </ul>
      ${p("A structured routine with Rodha's mentorship can transform your preparation. <a href='/contact'>Get in touch with our counsellors</a>.")}
    `,
    publishedDate: "2026-05-03",
    readTime: "5 min read",
    metaTitle: "Time Management Tips for Exam Preparation | Rodha",
    metaDescription:
      "Effective time management techniques for competitive exam preparation — Pomodoro, weekly planning, and productivity tips.",
    metaKeywords: ["time management", "study tips", "exam preparation", "productivity"],
    tags: ["Study Tips", "Productivity"],
    excerpt: "Master the art of managing your study time effectively.",
    image: getThumbnail("blog-1"),
    publishedAt: "2026-05-03",
    author: "Rodha Team",
  },
  {
    id: "b9",
    slug: "ipmat-vs-integrated-programs-which-path",
    title: "IPMAT vs Other Integrated Programs: Which Path Is Right for You?",
    category: "ipmat",
    thumbnail: getThumbnail("blog-4"),
    shortDescription:
      "A comparative analysis of IPMAT and 5-year integrated programs to help you make an informed decision for your management career.",
    content: `
      <h2>Understanding IPMAT</h2>
      ${p("The Integrated Programme in Management Aptitude Test (IPMAT) is a national-level entrance exam for admission into 5-year Integrated Programmes in Management (IPM) at IIM Indore, IIM Rohtak and other top institutes.")}
      <h3>Key Differences</h3>
      ${p("IPMAT focuses on quantitative ability and verbal ability, while other integrated programs like JIPMAT and SET may have different exam patterns and eligibility criteria.")}
      <ul>
        <li><strong>Duration:</strong> 5 years (After Class 12)</li>
        <li><strong>Focus:</strong> Management + Liberal Arts education</li>
        <li><strong>Top Institutes:</strong> IIM Indore, IIM Rohtak</li>
      </ul>
      ${p("<a href='/category/ipmat'>Explore Rodha's IPMAT programs</a> for comprehensive preparation.")}
    `,
    publishedDate: "2026-04-28",
    readTime: "6 min read",
    metaTitle: "IPMAT vs Integrated Programs — Which Path? | Rodha",
    metaDescription:
      "Compare IPMAT with other 5-year integrated management programs — eligibility, exam pattern, and career prospects.",
    metaKeywords: ["IPMAT", "integrated programs", "IIM Indore", "IPM"],
    tags: ["IPMAT", "Comparison"],
    excerpt: "A comparative analysis of IPMAT and 5-year integrated programs.",
    image: getThumbnail("blog-4"),
    publishedAt: "2026-04-28",
    author: "Rodha Team",
  },
  {
    id: "b10",
    slug: "clat-2026-syllabus-pattern-preparation",
    title: "CLAT 2026 Syllabus, Pattern & Preparation Tips",
    category: "clat",
    thumbnail: getThumbnail("blog-1"),
    shortDescription:
      "Everything you need to know about CLAT 2026 — complete syllabus breakdown, exam pattern, and expert preparation tips.",
    content: `
      <h2>CLAT 2026 Exam Overview</h2>
      ${p("The Common Law Admission Test (CLAT) is the primary entrance exam for admission to 22 National Law Universities across India. The 2026 edition is expected in December.")}
      <h3>Exam Pattern</h3>
      <ul>
        <li><strong>Duration:</strong> 2 hours</li>
        <li><strong>Questions:</strong> 150 (MCQ-based)</li>
        <li><strong>Sections:</strong> English, Current Affairs & GK, Legal Reasoning, Logical Reasoning, Quantitative Techniques</li>
        <li><strong>Marking:</strong> +1 for correct, −0.25 for incorrect</li>
      </ul>
      <h3>Section-wise Preparation</h3>
      ${p("For English, focus on reading comprehension of 450–500 word passages. For legal reasoning, practise principle-fact based questions from constitutional and contract law.")}
      ${p("<a href='/category/clat'>Start your CLAT preparation with Rodha</a>.")}
    `,
    publishedDate: "2026-04-22",
    readTime: "7 min read",
    metaTitle: "CLAT 2026 Syllabus, Pattern & Tips | Rodha",
    metaDescription:
      "Complete CLAT 2026 syllabus, exam pattern, and section-wise preparation tips from Rodha's law experts.",
    metaKeywords: ["CLAT 2026", "CLAT syllabus", "CLAT preparation", "NLU admission"],
    tags: ["CLAT", "Syllabus", "Preparation"],
    excerpt: "Everything you need to know about CLAT 2026.",
    image: getThumbnail("blog-1"),
    publishedAt: "2026-04-22",
    author: "Rodha Team",
  },
  {
    id: "b11",
    slug: "cat-preparation-strategy-6-months-plan",
    title: "CAT 2026 Preparation Strategy: 6 Months Plan That Works",
    category: "mba-cat",
    thumbnail: getThumbnail("blog-4"),
    shortDescription:
      "A step-by-step guide to help you navigate your MBA preparation journey with clarity and confidence.",
    content: `
      <h2>Your 6-Month CAT Preparation Blueprint</h2>
      ${p("With six months of focused preparation, you can achieve a strong CAT percentile. Here's a tried-and-tested plan used by Rodha's top scorers.")}
      <h3>Phase 1: Foundation (Month 1–2)</h3>
      ${p("Cover all basic concepts in QA, VARC, and DILR. Use textbooks for theory and solve 30+ practice problems per day.")}
      <h3>Phase 2: Practice & Speed (Month 3–4)</h3>
      ${p("Focus on speed and accuracy. Start sectional mocks and time-bound practice sets. Target 50 questions per hour.")}
      <h3>Phase 3: Mocks & Revision (Month 5–6)</h3>
      ${p("Take 3 full mocks per week. Maintain an error journal. Revise formulas and shortcuts daily.")}
      ${p("<a href='/category/cat'>Join Rodha's CAT program</a> for expert mentorship throughout your journey.")}
    `,
    publishedDate: "2026-04-15",
    readTime: "8 min read",
    metaTitle: "CAT 2026 Preparation Strategy — 6 Month Plan | Rodha",
    metaDescription:
      "Step-by-step 6-month CAT 2026 preparation plan covering QA, VARC, DILR with mock test strategy.",
    metaKeywords: ["CAT preparation", "6 month plan", "CAT strategy", "MBA entrance"],
    tags: ["CAT", "Strategy", "Preparation"],
    excerpt: "A step-by-step guide to navigate your MBA preparation journey.",
    image: getThumbnail("blog-4"),
    publishedAt: "2026-04-15",
    author: "Rodha Team",
  },
  {
    id: "b12",
    slug: "top-10-study-habits-toppers-follow",
    title: "Top 10 Study Habits of Toppers You Should Follow",
    category: "study-tips",
    thumbnail: getThumbnail("blog-4"),
    shortDescription:
      "Discover the study habits that separate toppers from average students and how you can adopt them.",
    content: `
      <h2>Habits That Make Toppers</h2>
      ${p("What separates a topper from the rest? It's rarely just intelligence — it's discipline, consistency, and smart study habits.")}
      <ol>
        <li><strong>Active recall over passive reading</strong> — test yourself instead of re-reading notes.</li>
        <li><strong>Spaced repetition</strong> — revise at increasing intervals for long-term retention.</li>
        <li><strong>Teach what you learn</strong> — explaining concepts solidifies understanding.</li>
        <li><strong>Minimise multi-tasking</strong> — deep focus beats scattered attention.</li>
        <li><strong>Set daily micro-goals</strong> — small wins build momentum.</li>
        <li><strong>Use one primary resource per topic</strong> — avoid information overload.</li>
        <li><strong>Sleep well</strong> — memory consolidation happens during sleep.</li>
        <li><strong>Exercise regularly</strong> — improves cognitive function and mood.</li>
        <li><strong>Join a study group</strong> — accountability and diverse perspectives help.</li>
        <li><strong>Review the day every night</strong> — 10 minutes of reflection before bed.</li>
      </ol>
      ${p("Adopt these habits and watch your performance transform.")}
    `,
    publishedDate: "2026-04-08",
    readTime: "5 min read",
    metaTitle: "Top 10 Study Habits of Toppers | Rodha",
    metaDescription:
      "Learn the proven study habits used by exam toppers — active recall, spaced repetition, and more.",
    metaKeywords: ["study habits", "toppers", "study tips", "exam preparation"],
    tags: ["Study Tips", "Habits"],
    excerpt: "Discover the study habits that separate toppers from average students.",
    image: getThumbnail("blog-4"),
    publishedAt: "2026-04-08",
    author: "Rodha Team",
  },
  {
    id: "b13",
    slug: "how-to-prepare-for-banking-exams-2026",
    title: "How to Prepare for Banking Exams in 2026",
    category: "banking",
    thumbnail: getThumbnail("blog-1"),
    shortDescription:
      "Step-by-step guide to prepare for IBPS PO, SBI PO, and other banking exams in 2026.",
    content: `
      <h2>Getting Started with Banking Exam Preparation</h2>
      ${p("Banking exams in India are conducted by IBPS, SBI, and RBI, covering roles from clerks to grade-B officers. A methodical approach is key.")}
      <h3>Core Sections to Master</h3>
      <ul>
        <li><strong>Quantitative Aptitude:</strong> Number series, simplification, DI, profit & loss.</li>
        <li><strong>Reasoning Ability:</strong> Puzzles, seating arrangements, syllogisms, inequalities.</li>
        <li><strong>English Language:</strong> Reading comprehension, cloze tests, error spotting.</li>
        <li><strong>General Awareness:</strong> Banking awareness, current affairs (last 6 months).</li>
      </ul>
      <h3>Monthly Plan</h3>
      ${p("Devote months 1–2 to fundamentals, months 3–4 to sectional practice, and months 5–6 to full-length mocks and current affairs revision.")}
      ${p("<a href='/category/banking'>Explore Rodha's Banking programs</a>.")}
    `,
    publishedDate: "2026-04-01",
    readTime: "6 min read",
    metaTitle: "How to Prepare for Banking Exams 2026 | Rodha",
    metaDescription:
      "Comprehensive banking exam preparation guide for IBPS PO, SBI PO, and RBI Grade B in 2026.",
    metaKeywords: ["banking exams", "IBPS PO preparation", "SBI PO", "banking"],
    tags: ["Banking", "Preparation"],
    excerpt: "Step-by-step guide to prepare for banking exams in 2026.",
    image: getThumbnail("blog-1"),
    publishedAt: "2026-04-01",
    author: "Rodha Team",
  },
  {
    id: "b14",
    slug: "career-after-clat-opportunities-in-law",
    title: "Career After CLAT: Opportunities in the Legal Field",
    category: "career-guidance",
    thumbnail: getThumbnail("blog-4"),
    shortDescription:
      "Explore the wide range of career opportunities available after cracking CLAT and graduating from an NLU.",
    content: `
      <h2>What Awaits After CLAT?</h2>
      ${p("A degree from a National Law University opens doors to some of the most prestigious and lucrative careers in India.")}
      <h3>Top Career Paths</h3>
      <ul>
        <li><strong>Corporate Law:</strong> Join top law firms like AZB, Cyril Amarchand, or Trilegal.</li>
        <li><strong>Litigation:</strong> Practice in courts — from district courts to the Supreme Court.</li>
        <li><strong>Judiciary:</strong> Become a judge through competitive judicial service exams.</li>
        <li><strong>Policy & Government:</strong> Roles in think tanks, ministries, and regulatory bodies.</li>
        <li><strong>Legal Tech & Startups:</strong> A growing sector combining law and technology.</li>
      </ul>
      ${p("The average salary for NLU graduates starts at ₹12–15 LPA, with top performers earning ₹30+ LPA in their first year.")}
      ${p("<a href='/category/clat'>Prepare for CLAT with Rodha</a>.")}
    `,
    publishedDate: "2026-03-25",
    readTime: "5 min read",
    metaTitle: "Career After CLAT — Legal Career Opportunities | Rodha",
    metaDescription:
      "Discover career paths after CLAT — corporate law, litigation, judiciary, policy, and legal tech opportunities.",
    metaKeywords: ["career after CLAT", "law career", "NLU placements", "legal career"],
    tags: ["CLAT", "Career Guidance"],
    excerpt: "Explore career opportunities after cracking CLAT.",
    image: getThumbnail("blog-4"),
    publishedAt: "2026-03-25",
    author: "Rodha Team",
  },
  {
    id: "b15",
    slug: "cat-2026-registration-process-guide",
    title: "CAT 2026 Registration: Step-by-Step Process Guide",
    category: "exam-updates",
    thumbnail: getThumbnail("blog-1"),
    shortDescription:
      "Complete walkthrough of the CAT 2026 registration process including important dates, documents, and fee details.",
    content: `
      <h2>CAT 2026 Registration Guide</h2>
      ${p("Registration for CAT 2026 is expected to open in August. Here's everything you need to know to complete your registration smoothly.")}
      <h3>Steps to Register</h3>
      <ol>
        <li>Visit the official CAT website and create an account.</li>
        <li>Fill in personal details, academic information, and work experience.</li>
        <li>Upload scanned photograph, signature, and category certificate (if applicable).</li>
        <li>Select test cities (up to 6 preferences).</li>
        <li>Pay the registration fee — ₹2,400 (General) / ₹1,200 (Reserved categories).</li>
        <li>Download and save the confirmation page.</li>
      </ol>
      <h3>Documents Required</h3>
      <ul>
        <li>Class 10 and 12 marksheets</li>
        <li>Graduation marksheet or enrollment certificate</li>
        <li>Valid photo ID (Aadhaar / Passport / PAN)</li>
        <li>Passport-size photograph</li>
        <li>Digital signature</li>
      </ul>
      ${p("Stay updated with <a href='/blog'>Rodha's blog</a> for official date announcements.")}
    `,
    publishedDate: "2026-03-18",
    readTime: "4 min read",
    metaTitle: "CAT 2026 Registration Process — Step by Step | Rodha",
    metaDescription:
      "Complete guide to CAT 2026 registration — steps, documents, fees, and important dates.",
    metaKeywords: ["CAT 2026 registration", "CAT registration process", "CAT 2026 dates"],
    tags: ["CAT", "Exam Updates", "Registration"],
    excerpt: "Complete walkthrough of the CAT 2026 registration process.",
    image: getThumbnail("blog-1"),
    publishedAt: "2026-03-18",
    author: "Rodha Team",
  },
  {
    id: "b16",
    slug: "ipmat-2026-important-topics-preparation-tips",
    title: "IPMAT 2026: Most Important Topics & Preparation Tips",
    category: "ipmat",
    thumbnail: getThumbnail("blog-4"),
    shortDescription:
      "Focus your IPMAT preparation on the topics that matter most — curated list of high-weightage topics and strategies.",
    content: `
      <h2>High-Weightage IPMAT Topics</h2>
      ${p("IPMAT has a consistent pattern of question types. Focusing on high-weightage topics can significantly boost your score.")}
      <h3>Quantitative Ability — Must-Do Topics</h3>
      <ul>
        <li>Number Systems & Divisibility</li>
        <li>Algebra — Equations & Inequalities</li>
        <li>Geometry — Triangles, Circles, Coordinate Geometry</li>
        <li>Arithmetic — Percentages, Profit & Loss, Time & Work</li>
        <li>Permutations & Combinations</li>
      </ul>
      <h3>Verbal Ability — Key Areas</h3>
      <ul>
        <li>Reading Comprehension (long and short passages)</li>
        <li>Para-jumbles and Sentence Completion</li>
        <li>Vocabulary in Context</li>
        <li>Grammar & Usage</li>
      </ul>
      ${p("Practice these topics with Rodha's curated question banks. <a href='/category/ipmat'>Explore IPMAT programs</a>.")}
    `,
    publishedDate: "2026-03-12",
    readTime: "5 min read",
    metaTitle: "IPMAT 2026 Important Topics & Tips | Rodha",
    metaDescription:
      "High-weightage IPMAT 2026 topics for quantitative ability and verbal ability with preparation tips.",
    metaKeywords: ["IPMAT 2026", "IPMAT topics", "IPMAT preparation", "IPMAT tips"],
    tags: ["IPMAT", "Topics", "Preparation"],
    excerpt: "Focus your IPMAT preparation on the topics that matter most.",
    image: getThumbnail("blog-4"),
    publishedAt: "2026-03-12",
    author: "Rodha Team",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getFeaturedPost(): BlogPost | undefined {
  return blogPosts.find((p) => p.featured);
}

export function getBlogCategory(id: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.id === id);
}

export function getLatestPosts(count = 4): BlogPost[] {
  return blogPosts.slice(0, count);
}

export function getFilteredPosts({
  category,
  query,
}: {
  category?: string;
  query?: string;
}): BlogPost[] {
  let results = blogPosts;

  if (category && category !== "all") {
    results = results.filter((post) => post.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.shortDescription.toLowerCase().includes(q) ||
        (post.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  }

  return results;
}

export function getPaginatedPosts(
  posts: BlogPost[],
  page: number,
  perPage = BLOG_ITEMS_PER_PAGE
): { items: BlogPost[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { items: posts.slice(start, start + perPage), totalPages };
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const current = getBlogBySlug(slug);
  if (!current) return blogPosts.slice(0, count);

  const currentTags = new Set((current.tags ?? []).map((t) => t.toLowerCase()));
  const others = blogPosts.filter((p) => p.slug !== slug);

  const scored = others.map((post) => {
    let score = 0;
    if (post.category === current.category) score += 10;
    const postTags = (post.tags ?? []).map((t) => t.toLowerCase());
    for (const tag of postTags) {
      if (currentTags.has(tag)) score += 3;
    }
    return { post, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.post);
}
