import fs from "node:fs";

const HOME = [
  {
    id: "gen-1",
    category: "general",
    question: "What exams does Rodha prepare students for?",
    answer:
      "Rodha runs five verticals: MBA entrance (CAT, SNAP, XAT, NMAT, CMAT, MAT and MAH-CET, including GDPI preparation), IPMAT and integrated management programmes, CLAT and law entrances, SSC and government exams, and Rodha SkillHouse for career and pre-MBA skills. Every vertical is taught by subject specialists on the same live-class and mentorship model.",
  },
  {
    id: "gen-2",
    category: "general",
    question: "Is Rodha's online coaching good enough on its own?",
    answer:
      "Rodha is built to be your only source of preparation. You get live classes with recordings, full-length mock tests with video solutions, previous year papers, structured study material and a mentor you can actually reach. Students preparing entirely at home with Rodha's CAT, OMETs and IPMAT programmes have converted the IIMs, and now through our CLAT and SSC verticals we gear up to help aspirants convert NLUs and government roles as well.",
  },
  {
    id: "gen-3",
    category: "general",
    question: "How do Rodha's online classes actually run?",
    answer:
      "Live classes run on a fixed weekly schedule, with every class recorded and available within 2 hours. You get structured study material, one-on-one mentorship where your mentor reviews your mock performance and adjusts your plan, and doubt-solving between sessions. A missed class is never a lost class.",
  },
  {
    id: "gen-4",
    category: "general",
    question: "How is Rodha different from other online coaching?",
    answer:
      "Two things. First, personalised mentorship rather than being left with a video library. You are directly connected to the faculty who teach in the classes through our Rodha Panchayat. Second, the teaching itself: Rodha began as a free CAT YouTube classroom and grew because of how concepts were explained, particularly in Quant. That same teaching is what's inside the paid course, with the structure, testing, resources and accountability that free content can't provide.",
  },
  {
    id: "gen-5",
    category: "general",
    question: "What's included in the test series?",
    answer:
      "Full-length mocks in the exact exam interface, sectional tests, topic-level practice sets, and every previous year paper with solutions. Each mock returns a detailed analysis — percentile projection, time per question, accuracy by topic, and where you lost marks you should have had.",
  },
  {
    id: "gen-6",
    category: "general",
    question: "What do courses cost, and what if I need to withdraw?",
    answer:
      "Fees vary by exam and format — full-course, crash and test-series-only options are priced separately on each course page. EMI is available. Refunds follow the published refund policy; the window and terms are stated on the course page before you pay, not after.",
  },
  {
    id: "gen-contact",
    category: "general",
    question: "How do I get in touch with Rodha?",
    answer:
      "Use the form on the Contact page, call or WhatsApp us during support hours, or email contactus@rodha.co.in. For instant help, chat with Rodha Buddy anytime.",
  },
];

const CATEGORY = [
  ["cat", "faq-1", "When should I start preparing for CAT 2026?", "Eight to twelve months is the honest answer for a first attempt from scratch. Starting earlier mostly buys you more mock cycles, and mocks are where percentiles actually move. If you're inside four months, take a crash course built for the time you have rather than a full syllabus course you won't finish. CAT 2026 is on 29 November, and registration closes 15 September."],
  ["cat", "faq-2", "Which Rodha CAT 2026 batch should I join?", "The content is identical across every comprehensive batch. What differs is the start date, the pace and the language. Choose by language first — Hinglish (R2, R3, R5, R6, R7, R8) or Complete English (R4). Then by pace: R8 is fast-tracked, R6 is high-intensity, the rest run standard. If you're inside four months, take the Crash Course instead. And you're not locked in — you can switch batches up to three times a year."],
  ["cat", "faq-3", "Can I prepare for CAT while working or studying full-time?", "Yes. Every live class is recorded and stays available in your account, so a missed session is never a lost session. Batches run 10–12 classes a week across different timings, and you can switch batches up to three times if your schedule changes. Doubts don't wait for the next class either — Rodha Buddy answers them 24×7."],
  ["cat", "faq-4", "How do I access the course after I enroll?", "Everything unlocks immediately. Create an account with the email you're enrolling with, and the batch appears under My Courses on the Rodha app or at www.rodha.co.in. Inside you'll find live classes on schedule, recordings of every session, study material and your practice sets. Your test series runs at mocks.rodha.co.in, and doubt-solving lives in the Rodha Buddy app at buddy.rodha.co.in. Your 12 physical booklets are couriered to your doorstep — the one part of the course that doesn't arrive by login. Access for all the batch runs until 10 January 2027, covering CAT and the OMET season that follows."],
  ["cat", "faq-5", "How does doubt-solving and mentorship work?", "Two ways, both included. Rodha Buddy is a dedicated doubt-solving app where Rodha mentors answer 24×7 — so a question at 1am on a Quant problem doesn't wait until the next class. Rodha Panchayat is the opposite end of the spectrum: face-to-face Google Meet sessions with the faculty who teach you, where your doubts get answered personally. Each subject has its own dedicated faculty — Quant with Ravi Sir, Swapanil Sir and Apoorv Sir; LRDI with Ravi Sir, Swapanil Sir, Apoorv Sir and Abhishek Sir; and VARC with KD Sir, Nikita Ma'am and Brijesh Sir — so you're learning each section from a specialist rather than one generalist across all three."],
  ["cat", "faq-6", "What practice material and test series do I get?", "30 RCMs (Rodha CAT Mock Tests) with detailed video solutions and in-depth performance analysis, plus 105 sectional tests across Quant, LRDI and VARC, and topic-wise practice tests. For practice volume: 2,000+ Quant questions, 300+ LRDI sets and 400+ RCs. You also get Concept Capsules for quick revision and the CAT Countdown Series from September 2026."],
  ["cat", "faq-7", "Does the course cover XAT, SNAP and NMAT too?", "Yes, and at no extra cost. Complete OMET courses for XAT, SNAP and NMAT — worth ₹12,000 — are included in every comprehensive batch, along with OMET mock tests with full analysis and dedicated strategy sessions for each exam. One enrollment covers your whole MBA entrance season, not just CAT."],
  ["ipmat", "faq-1", "When should I start preparing for IPMAT 2027?", "Now, if you're in Class 11. IPMAT 2027 is roughly nine to ten months out, which is the sweet spot - long enough to build quant and verbal from fundamentals, short enough that you'll actually stay serious about it. The students who struggle aren't the ones who lack ability; they're the ones who start in the last three months and then have to choose between board exams and IPMAT preparation. Start now and you never face that choice. A realistic IPMAT 2027 plan looks like: fundamentals until December, timed practice from January, and mocks every week in the final stretch."],
  ["ipmat", "faq-2", "I'm in Class 10 or just entering Class 11 - is it too early to start IPMAT 2028 preparation?", "It isn't too early, and a two-year runway is genuinely the strongest position you can be in. IPMAT 2028 preparation from Class 10 doesn't mean grinding mocks for two years - it means getting Class 9-10 maths genuinely solid and building a reading habit while you still have the time to do it slowly. Those two things are what separate a 99 percentiler from everyone else, and neither can be crammed. Students who start in Class 10 usually spend year one on fundamentals and reading, then move to exam-format practice in year two."],
  ["ipmat", "faq-3", "Which Rodha batch should I join for IPMAT 2027 or IPMAT 2028?", "Pick by how much runway you have, not by price. If you're targeting IPMAT 2027, the comprehensive online batch covers the full syllabus live with enough time for a proper revision cycle. If you're targeting IPMAT 2028, the two-year track paces the same material across a longer period so it never collides with your school year. Not sure yet? Start with the free course - you'll know within two weeks whether our teaching works for you, and it costs nothing to find out. Every class is online and recorded, so your city doesn't decide your faculty."],
  ["ipmat", "faq-4", "Can I prepare for IPMAT 2027 while handling Class 12 boards?", "Yes, and this is the real challenge of IPMAT rather than the syllabus itself. The overlap is your advantage: much of IPMAT quant sits on the same Class 9-12 foundation your school maths is already building, so the two reinforce each other if you plan them together. What makes it work practically is that classes are live but recorded - a school test week never costs you a topic, you just catch up. IPMAT preparation at home only fails when doubts pile up, so get them answered the same week rather than saving them for later."],
  ["ipmat", "faq-5", "What is the IPMAT syllabus and when should I start Quant and Verbal?", "Quantitative Ability and Verbal Ability are the core, with IIM Rohtak's paper also testing Logical Reasoning. The maths sits around Class 9-12 level - arithmetic, algebra, geometry, numbers, modern maths - so nothing in it is beyond you; the difficulty is doing it accurately under a clock. Start both sections together from day one. The most common mistake in IPMAT preparation is treating verbal as something to handle at the end: IPMAT quant preparation responds to months of practice, but IPMAT verbal ability preparation depends on reading speed and comprehension, which only improve slowly over a long period. With a 2027 or 2028 timeline you have exactly the runway that rewards starting verbal early."],
  ["ipmat", "faq-6", "How do mock tests and previous year papers fit into a 2027 or 2028 plan?", "Differently at each stage, which is the point of starting early. In year one you're building concepts, so topic tests matter more than full mocks. Once fundamentals are in place, full-length IPMAT mock tests in exam conditions become the thing that actually moves your score, because IPMAT punishes hesitation as much as it punishes error. IPMAT previous year papers are worth more here than in most exams - the paper has a recognisable personality and the same topics return in familiar shapes. Take the free IPMAT mock test early, even if you feel unready; an honest baseline in Class 11 is far more useful than a flattering one in Class 12."],
  ["clat", "faq-1", "Who is this programme for?", "The Sampoorna Batch is designed for students preparing for CLAT, AILET, and other law entrances."],
  ["clat", "faq-2", "Will there be any mentorship?", "Yes. The Sampoorna batch has personalised 1:1 mentorship with the faculties taking the course."],
  ["clat", "faq-3", "Are sessions live or recorded?", "Sessions are conducted live on our portal, and you can also access the recordings anytime."],
  ["clat", "faq-4", "Do I need any prior knowledge to join?", "No. Our batches start from the basics across all five sections: Legal Reasoning, English, Current Affairs, Logical Reasoning and Quantitative Techniques."],
  ["clat", "faq-5", "How do I enrol?", "Click Enrol for Free and complete the registration. For help, WhatsApp us or email contactus@rodha.co.in."],
  ["clat", "faq-6", "What is the best time to start CLAT preparation?", "Ideally 10–12 months before the exam. Early starters can build legal reasoning and reading habits deeply, while later batches focus on mocks and current affairs. Rodha offers Foundation and Complete tracks for every timeline."],
  ["clat", "faq-7", "Can Class 11 and 12 students join CLAT batches?", "Absolutely. Our Foundation and Complete programs are designed for school students balancing board exams with NLU preparation."],
  ["ssc", "faq-1", "Which SSC exams does RODHA prepare students for?", "RODHA SSC provides preparation for major exams including SSC CGL, SSC CHSL and SSC CPO, covering the core subjects required for these examinations."],
  ["ssc", "faq-2", "Which subjects are covered?", "Our comprehensive batches cover Quantitative Aptitude, General Intelligence & Reasoning, English Language and General Awareness."],
  ["ssc", "faq-3", "Are RODHA SSC classes available in Hindi?", "Yes. RODHA offers bilingual Hindi + English preparation through its Foundation offering, while the SSC Prime Batch is designed specifically for English-medium aspirants."],
  ["ssc", "faq-4", "Is the Prime Batch completely in English?", "Yes. The Prime Batch is designed as a 100% English-medium preparation ecosystem, including teaching, study material, tests and doubt support."],
  ["ssc", "faq-5", "Are classes live or recorded?", "RODHA offers live classes along with recording access, allowing students to revise and rewatch classes at their convenience."],
  ["ssc", "faq-6", "What study material is provided?", "Students get structured study resources including RODHA Worksheets, topic-wise practice, PYQs, tests, revision sessions and other exam-oriented material."],
  ["ssc", "faq-7", "Does RODHA provide doubt support?", "Yes. Students have access to dedicated doubt-clearing support and faculty mentorship depending on the program."],
  ["ssc", "faq-8", "Can I buy only one subject?", "Yes. Subject-wise courses are available for students who want focused preparation for a particular section."],
  ["ssc", "faq-9", "Is there any free content available?", "Yes. RODHA SSC provides free classes, strategy sessions and exam-related content through its YouTube channel, along with a free SSC course."],
  ["ssc", "faq-10", "How do I choose between Foundation and Prime?", "Choose Foundation if you prefer bilingual Hindi + English learning. Choose Prime if you want a completely English-medium SSC preparation ecosystem."],
  ["skillhouse", "faq-1", "Who are these programs for?", "Rodha Skillhouse programs are designed for incoming MBA students who want to hit the ground running, MBA aspirants building their profile, and working managers who want to leverage AI in their daily work."],
  ["skillhouse", "faq-2", "Are sessions live or recorded?", "Sessions are primarily conducted live to ensure real-time interaction with mentors. Recordings are provided for revision. The key value is in attending live sessions."],
  ["skillhouse", "faq-3", "Will I receive a certificate after completion?", "Yes. You receive a certificate of completion upon finishing the program. BLFP students also earn skill-specific badges based on participation and assessments."],
  ["skillhouse", "faq-4", "Do I need prior knowledge or technical skills?", "No prior knowledge is required for either program. BLFP builds from the basics in Excel, Power BI, AI tools, and finance. AI for Managers requires no coding background."],
  ["skillhouse", "faq-5", "Is there a community after the program?", "Yes. BLFP students get lifetime access to an exclusive alumni and learner community. You'll stay connected with mentors and peers long after the program ends."],
  ["skillhouse", "faq-6", "How do I enroll?", "Choose a program on this page, click Enroll, on any program listed on this page, choose your course, and complete the checkout on Rodha Skillhouse. For help, WhatsApp us or email contactus@rodha.co.in."],
].map(([category, id, question, answer]) => ({
  id: `${category}-${id}`,
  category,
  question,
  answer,
}));

// Dedupe by normalized question
const seen = new Set();
const FAQ_DATA = [];
for (const item of [...HOME, ...CATEGORY]) {
  const key = item.question.trim().toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  FAQ_DATA.push(item);
}

const counts = {};
for (const item of FAQ_DATA) {
  counts[item.category] = (counts[item.category] || 0) + 1;
}
console.log("FAQ counts", counts, "total", FAQ_DATA.length);

const file = `export interface FAQCategory {
  id: string;
  label: string;
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  { id: "all", label: "All" },
  { id: "general", label: "General" },
  { id: "cat", label: "CAT" },
  { id: "ipmat", label: "IPMAT" },
  { id: "ssc", label: "SSC" },
  { id: "clat", label: "CLAT" },
  { id: "skillhouse", label: "Skill House" },
];

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS_PER_PAGE = 10;

/** Aggregated FAQs for /faq — sourced from homepage + category landings (deduped). */
export const FAQ_DATA: FAQItem[] = ${JSON.stringify(FAQ_DATA, null, 2)};

/** Homepage FAQ accordion — keep in sync with General items above where shared. */
export const FAQ_DATA_HOME: FAQItem[] = ${JSON.stringify(HOME.filter((h) => h.id !== "gen-contact"), null, 2)};

export function getFaqsByCategory(categoryId: string): FAQItem[] {
  if (categoryId === "all") return FAQ_DATA;
  return FAQ_DATA.filter((item) => item.category === categoryId);
}

export function searchFaqs(items: FAQItem[], query: string): FAQItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q)
  );
}
`;

fs.writeFileSync("src/data/faq.ts", file);
console.log("Wrote faq.ts");
