import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseDetailPageView } from "@/components/sections/course/CourseDetailPage";
import {
  getAllCourses,
  getCourseBySlug,
  getCoursePath,
  withCourseDetailDefaults,
} from "@/data/course-details";
import { buildPageMetadata } from "@/lib/seo";

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllCourses().map(({ course }) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const match = getCourseBySlug(slug);

  if (!match) {
    return { title: "Course — Rodha" };
  }

  const course = withCourseDetailDefaults(match.course);

  return buildPageMetadata({
    title: `${course.title} — ${match.landing.name} Course — Rodha`,
    description: course.shortDescription || course.description,
    path: getCoursePath(course.slug),
    image: course.thumbnail || course.image,
  });
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;
  const match = getCourseBySlug(slug);

  if (!match) {
    notFound();
  }

  return (
    <CourseDetailPageView course={match.course} landing={match.landing} />
  );
}
