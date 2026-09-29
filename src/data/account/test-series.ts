import type { TestSeriesItem } from "@/lib/types";

const CAT = "/assets/images/courses/cat";
const MOCKS = "/assets/images/category/cat/mocks";

/**
 * Account Test Series listing — `TestSeriesItem` shape for `TestSeriesCardV2`.
 * Prices are display strings (₹…) to match the marketing card contract.
 */
export const ACCOUNT_TEST_SERIES: TestSeriesItem[] = [
  {
    id: "ts-cat-mocks",
    title: "CAT 2026 Mock Test Series",
    description:
      "Full-length CAT mocks with detailed video solutions and analytics.",
    href: "https://mocks.rodha.co.in/",
    icon: "mock",
    image: `${CAT}/rodha-cat-mocks.png`,
    value: "30+",
    price: "₹7,000",
    offerPrice: "₹4,999",
  },
  {
    id: "ts-cat-omets",
    title: "CAT + OMETs Mock Package",
    description:
      "CAT mocks bundled with SNAP, XAT, NMAT and CMAT practice tests.",
    href: "https://mocks.rodha.co.in/",
    icon: "package",
    image: `${CAT}/rodha-cat-mocks-and-omets-package.png`,
    value: "50+",
    price: "₹9,999",
    offerPrice: "₹6,999",
  },
  {
    id: "ts-sectionals",
    title: "Rodha CAT Sectional Tests",
    description:
      "Section-wise mocks for Quant, VARC and DILR with topic filters.",
    href: "https://mocks.rodha.co.in/",
    icon: "sectional",
    image: `${CAT}/rodha-sectional-tests.png`,
    value: "40+",
    price: "₹4,999",
    offerPrice: "₹2,999",
  },
  {
    id: "ts-qa-1000",
    title: "CAT 2026 QA 1000 Questions",
    description:
      "Curated Quant question bank with difficulty tags and solutions.",
    href: "https://mocks.rodha.co.in/",
    icon: "qa",
    image: `${MOCKS}/cat mocks-3.png`,
    value: "1000",
    price: "₹10,000",
    offerPrice: "₹6,999",
  },
  {
    id: "ts-varc-1000",
    title: "CAT 2026 VARC 1000 Questions",
    description:
      "RC passages, VA drills and topic-wise verbal practice sets.",
    href: "https://mocks.rodha.co.in/",
    icon: "varc",
    image: `${MOCKS}/cat sectionals-2.png`,
    value: "1000",
    price: "₹10,000",
    offerPrice: "₹6,999",
  },
  {
    id: "ts-lrdi-1000",
    title: "CAT 2026 LRDI 1000 Questions",
    description:
      "Set-based LRDI practice with timed drills and solution videos.",
    href: "https://mocks.rodha.co.in/",
    icon: "lrdi",
    image: `${MOCKS}/sectional topic tests-4.png`,
    value: "1000",
    price: "₹10,000",
    offerPrice: "₹6,999",
  },
  {
    id: "ts-free-mocks",
    title: "Rodha Free CAT Mocks",
    description: "Start with free full-length mocks to benchmark your level.",
    href: "https://mocks.rodha.co.in/",
    icon: "free",
    image: `${CAT}/rodha-free-mocks.png`,
    value: "5",
    price: "FREE",
    offerPrice: "FREE",
  },
  {
    id: "ts-mocks-sectionals",
    title: "CAT Mocks + Sectional Tests Bundle",
    description:
      "Combined full-length mocks and sectionals for end-to-end practice.",
    href: "https://mocks.rodha.co.in/",
    icon: "bundle",
    image: `${CAT}/rodha-cat-mocks-and-sectional-tests.png`,
    value: "70+",
    price: "₹12,000",
    offerPrice: "₹8,499",
  },
  {
    id: "ts-topic-tests",
    title: "CAT Topic-wise Practice Tests",
    description:
      "Short topic tests to plug gaps before attempting full mocks.",
    href: "https://mocks.rodha.co.in/",
    icon: "topic",
    image: `${MOCKS}/4.png`,
    value: "80+",
    price: "₹3,999",
    offerPrice: "₹2,499",
  },
  {
    id: "ts-omet-focus",
    title: "OMETs Focus Test Series 2026",
    description:
      "Dedicated SNAP, XAT, NMAT and CMAT mocks with score predictors.",
    href: "https://mocks.rodha.co.in/",
    icon: "omet",
    image: `${MOCKS}/cat & omets-1.jpg`,
    value: "25+",
    price: "₹5,999",
    offerPrice: "₹3,999",
  },
];
