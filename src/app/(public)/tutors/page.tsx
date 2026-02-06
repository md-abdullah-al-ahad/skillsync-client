import { Suspense } from "react";
import { tutorService } from "@/services/tutor.service";
import { adminService } from "@/services/admin.service";
import TutorFilters from "@/components/modules/tutors/TutorFilters";
import TutorCard from "@/components/modules/tutors/TutorCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { TutorFilters as TutorFiltersType } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Tutors | SkillSync",
  description: "Browse and find expert tutors for your learning needs",
};

interface TutorsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function TutorsList({ filters }: { filters: TutorFiltersType }) {
  const { data: tutors, error } = await tutorService.getTutors(filters);

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Failed to load tutors</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!tutors || tutors.length === 0) {
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    minPrice: typeof params.minPrice === "string" ? Number(params.minPrice) : undefined,
    maxPrice: typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined,
    rating: typeof params.rating === "string" ? Number(params.rating) : undefined,
  };

  // Fetch categories for filter
  const { data: categories } = await adminService.getAllCategories();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Your Perfect Tutor</h1>
        <p className="mt-2 text-muted-foreground">
          Browse through our expert tutors and find the perfect match for your learning goals
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px,1fr]">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <TutorFilters categories={categories || []} />
        </aside>

        {/* Tutors Grid */}
        <main>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filters.search && `Results for "${filters.search}"`}
            </p>
          </div>

          <Suspense fallback={<TutorsListSkeleton />}>
            <TutorsList filters={filters} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
