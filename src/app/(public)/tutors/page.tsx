import { Suspense } from "react";
import { tutorService } from "@/services/tutor.service";
import { adminService } from "@/services/admin.service";
import TutorFilters from "@/components/modules/tutors/TutorFilters";
import TutorCard from "@/components/modules/tutors/TutorCard";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  TutorFilters as TutorFiltersType,
  TutorProfile as TutorProfileType,
  Category,
} from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Tutors | SkillSync",
  description: "Browse and find expert tutors for your learning needs",
};

interface TutorsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function TutorsList({ filters }: { filters: TutorFiltersType }) {
  const { data: tutorsResponse, error } = await tutorService.getTutors(filters);
  const tutors: TutorProfileType[] = Array.isArray(tutorsResponse?.data)
    ? (tutorsResponse.data as TutorProfileType[])
    : [];

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Failed to load tutors</p>
          <p className="text-sm text-muted-foreground">
            {error.message || "An error occurred"}
          </p>
        </div>
      </div>
    );
  }

  if (tutors.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">No tutors found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters to find more results
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
}

function TutorsListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-lg border p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function TutorsPage({ searchParams }: TutorsPageProps) {
  const params = await searchParams;

  // Build filters from search params
  const filters: TutorFiltersType = {
    search: typeof params.search === "string" ? params.search : "",
    category: typeof params.category === "string" ? params.category : "",
    minPrice:
      typeof params.minPrice === "string" ? Number(params.minPrice) : undefined,
    maxPrice:
      typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined,
    minRating:
      typeof params.minRating === "string"
        ? Number(params.minRating)
        : typeof params.rating === "string"
          ? Number(params.rating)
          : undefined,
  };

  // Fetch categories for filter
  const { data: categoriesResponse } = await adminService.getAllCategories();
  const categories: Category[] = Array.isArray(categoriesResponse)
    ? (categoriesResponse as Category[])
    : [];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border/60 bg-muted/20 py-14">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                Tutor Directory
              </p>
              <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
                Find Your Perfect Tutor
              </h1>
              <p className="mt-3 text-muted-foreground">
                Browse verified tutors and book sessions tailored to your
                learning goals.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/70 p-5">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                <span>Search Status</span>
                <span className="text-foreground">Live</span>
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <span>Filters update results instantly.</span>
                <span>Use rating and price to narrow the list.</span>
              </div>
              {filters.search && (
                <div className="mt-4 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Results for:{" "}
                  <span className="text-foreground">{filters.search}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            {/* Tutors Grid */}
            <main className="lg:col-start-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Tutors
                </p>
              </div>

              <Suspense fallback={<TutorsListSkeleton />}>
                <TutorsList filters={filters} />
              </Suspense>
            </main>

            {/* Filters Sidebar */}
            <aside className="space-y-6 lg:col-start-2 lg:sticky lg:top-24 lg:self-start lg:justify-self-end">
              <TutorFilters categories={categories} />
              <div className="rounded-2xl border border-border/60 bg-card/70 p-5 text-sm text-muted-foreground">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Tip
                </p>
                <p className="mt-3">
                  Combine category and rating to surface the most trusted
                  tutors.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
