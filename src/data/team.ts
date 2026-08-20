import type {
  Advisor,
  CultureValue,
  LeadershipMember,
  TeamHeroStat,
} from "@/lib/types";

const TEAM_ASSETS = "/assets/images/meet the team";

export const TEAM_HERO = {
  titleBefore: "The People Behind Every",
  titleHighlight: "Success Story",
  description:
    "We're a passionate team of educators, mentors, and innovators dedicated to transforming how India prepares for competitive exams.",
  image: `${TEAM_ASSETS}/rodha-team-hero.jpg`,
  imageAlt: "Rodha team collaborating in the office",
};

export const TEAM_HERO_STATS: TeamHeroStat[] = [
  {
    id: "faculty",
    value: "20+",
    label: "Expert Faculty",
    icon: `${TEAM_ASSETS}/icons/hero-faculty.png`,
  },
  {
    id: "experience",
    value: "15+",
    label: "Years Avg. Exp.",
    icon: `${TEAM_ASSETS}/icons/hero-experience-star.png`,
  },
  {
    id: "students",
    value: "1,00,000+",
    label: "Students Mentored",
    icon: `${TEAM_ASSETS}/icons/hero-student.png`,
  },
];

export const leadership: LeadershipMember[] = [
  {
    id: "lead-1",
    name: "Arvind Sharma",
    role: "Co-Founder & CEO",
    bio: "Visionary educator with 15+ years shaping competitive exam coaching across India.",
    image: "/assets/images/profiles/male-1.png",
    linkedIn: "https://www.linkedin.com/",
  },
  {
    id: "lead-2",
    name: "Neha Bansal",
    role: "Co-Founder & COO",
    bio: "Operations leader focused on student success systems and faculty excellence.",
    image: "/assets/images/profiles/female-1.png",
    linkedIn: "https://www.linkedin.com/",
  },
  {
    id: "lead-3",
    name: "Rohan Mehta",
    role: "Head of Academics",
    bio: "Curriculum architect ensuring every Rodha program is rigorous and result-oriented.",
    image: "/assets/images/profiles/male-2.png",
    linkedIn: "https://www.linkedin.com/",
  },
  {
    id: "lead-4",
    name: "Priya Iyer",
    role: "Chief Learning Officer",
    bio: "Learning design expert building mentorship frameworks for high-performing aspirants.",
    image: "/assets/images/profiles/female-2.png",
    linkedIn: "https://www.linkedin.com/",
  },
  {
    id: "lead-5",
    name: "Karan Malhotra",
    role: "Head of Technology",
    bio: "Product and engineering lead crafting AI-powered tools for personalized preparation.",
    image: "/assets/images/profiles/male-3.png",
    linkedIn: "https://www.linkedin.com/",
  },
];

export const advisors: Advisor[] = [
  {
    id: "advisor-1",
    name: "Dr. Ananya Rao",
    role: "Academic Advisor",
    formerRole: "Former Director",
    formerOrganization: "IIM Bangalore",
    image: "/assets/images/profiles/female-3.png",
  },
  {
    id: "advisor-2",
    name: "Rajesh Khanna",
    role: "Industry Mentor",
    formerRole: "Ex-VP Strategy",
    formerOrganization: "Flipkart",
    image: "/assets/images/profiles/male-4.png",
  },
  {
    id: "advisor-3",
    name: "Meera Kapoor",
    role: "Career Advisor",
    formerRole: "Former Partner",
    formerOrganization: "McKinsey & Company",
    image: "/assets/images/profiles/female-4.png",
  },
];

export const cultureValues: CultureValue[] = [
  {
    id: "student-first",
    title: "Student First",
    description:
      "Every decision we make starts with what's best for our students' growth and success.",
    icon: `${TEAM_ASSETS}/icons/culture-student-first.png`,
  },
  {
    id: "integrity",
    title: "Integrity",
    description:
      "We stay honest, transparent, and accountable in every promise we make to aspirants.",
    icon: `${TEAM_ASSETS}/icons/culture-integrity.png`,
  },
  {
    id: "excellence",
    title: "Excellence",
    description:
      "We relentlessly raise the bar on content quality, mentoring, and learning outcomes.",
    icon: `${TEAM_ASSETS}/icons/culture-exelence.png`,
  },
  {
    id: "collaboration",
    title: "Collaboration",
    description:
      "Faculty, mentors, and teams work as one to unlock every student's potential.",
    icon: `${TEAM_ASSETS}/icons/culture-collaborate.png`,
  },
];

export const LEADERSHIP_INTRO =
  "Our leadership team brings decades of experience in education, technology, and business — united by a shared mission to democratize quality exam preparation.";
