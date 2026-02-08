import { notFound } from "next/navigation";
import { tutorService } from "@/services/tutor.service";
import { reviewService } from "@/services/review.service";
import TutorDetailClient from "@/components/modules/tutors/TutorDetailClient";
import type { Metadata } from "next";
import type { TutorProfile as TutorProfileType } from "@/types";

interface TutorDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: TutorDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { data: tutor } = await tutorService.getTutorById(id);

  if (!tutor) {
    return {
      title: "Tutor Not Found | SkillSync",
    };
  }

  return {
    title: `${tutor.user?.name || "Tutor"} - Professional Tutor | SkillSync`,
    description:
      tutor.bio || `Book a session with ${tutor.user?.name || "this tutor"}`,
  };
}

export async function generateStaticParams() {
  // Generate static pages for top tutors
  const { data: tutorsResponse } = await tutorService.getTutors({
    minRating: 4,
  });

  const tutors = Array.isArray(tutorsResponse?.data)
    ? tutorsResponse.data
    : [];

  // Return the first 20 tutors for static generation
  return tutors.slice(0, 20).map((tutor: TutorProfileType) => ({
    id: tutor.id,
  }));
}

export default async function TutorDetailPage({
  params,
}: TutorDetailPageProps) {
  const { id } = await params;

  // Fetch tutor details
  const { data: tutor, error: tutorError } =
    await tutorService.getTutorById(id);

  if (tutorError || !tutor) {
    notFound();
  }

  // Fetch reviews for this tutor
  const { data: reviewsResponse } = await reviewService.getReviewsByTutor(id);
  const reviews = Array.isArray((reviewsResponse as { data?: unknown })?.data)
    ? ((reviewsResponse as { data: any[] }).data || [])
    : Array.isArray(reviewsResponse)
      ? reviewsResponse
      : [];

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <TutorDetailClient tutor={tutor} reviews={reviews} />
      </div>
    </div>
  );
}
