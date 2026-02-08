"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  Clock,
  Mail,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { TutorProfile as TutorProfileType, Review, Category } from "@/types";

interface TutorProfileProps {
  tutor: TutorProfileType;
  reviews?: Review[];
  onBookSession?: () => void;
}

export default function TutorProfile({
  tutor,
  reviews = [],
  onBookSession,
}: TutorProfileProps) {
  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const normalizeCategory = (item: unknown): Category | null => {
    if (!item || typeof item !== "object") return null;
    if ("category" in item) {
      const nested = (item as { category?: unknown }).category;
      if (nested && typeof nested === "object") {
        return nested as Category;
      }
    }
    if ("id" in item && "name" in item) {
      return item as Category;
    }
    return null;
  };
  const categories = Array.isArray(tutor.categories)
    ? (tutor.categories as unknown[])
        .map(normalizeCategory)
        .filter((cat): cat is Category => Boolean(cat))
    : [];
  const availability =
    Array.isArray((tutor as { availability?: unknown }).availability)
      ? (tutor as { availability: any[] }).availability
      : Array.isArray((tutor as { availabilitySlots?: unknown }).availabilitySlots)
        ? (tutor as { availabilitySlots: any[] }).availabilitySlots
        : [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateAverageRating = () => {
    if (safeReviews.length === 0) return 0;
    const sum = safeReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / safeReviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-3xl border border-border/60 bg-gradient-to-b from-background/80 via-card/85 to-muted/30 p-8 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.45)]">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">
          <div className="space-y-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Avatar className="h-24 w-24 border border-border/70 shadow-sm">
                <AvatarImage
                  src={tutor.user?.image || undefined}
                  alt={tutor.user?.name || "Tutor"}
                  className="grayscale"
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(tutor.user?.name || "Tutor")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                  Tutor Profile
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-foreground">
                  {tutor.user?.name || "Tutor"}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Professional Tutor
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <Star className="h-4 w-4 fill-foreground text-foreground" />
                <span className="font-semibold">{averageRating}</span>
                <span className="text-muted-foreground">
                  ({safeReviews.length} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>{tutor.experience || 0}+ years experience</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{categories.length} subjects</span>
              </div>
            </div>

            {tutor.user?.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{tutor.user.email}</span>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Session Rate
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-3xl font-semibold text-foreground">
                {formatCurrency(tutor.hourlyRate || 0)}
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                /hour
              </span>
            </div>
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={onBookSession}
              disabled={!onBookSession}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Book Session
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {tutor.bio && (
            <section className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                About
              </p>
              <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
                {tutor.bio}
              </p>
            </section>
          )}

          <section className="rounded-2xl border border-border/60 bg-card/70 p-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Reviews ({safeReviews.length})
              </p>
            </div>
            {safeReviews.length > 0 ? (
              <div className="mt-5 space-y-4">
                {safeReviews.map((review) => (
                  <div
                    key={review.id}
                    className="space-y-3 border-b border-border/60 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={review.student?.image || undefined}
                            alt={review.student?.name || "Student"}
                            className="grayscale"
                          />
                          <AvatarFallback>
                            {getInitials(review.student?.name || "Student")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {review.student?.name || "Student"}
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-foreground text-foreground"
                                    : "fill-muted text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <Star className="mx-auto mb-2 h-8 w-8 text-muted" />
                <p>No reviews yet</p>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          {categories.length > 0 && (
            <section className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Subjects
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="text-[0.65rem] uppercase tracking-[0.2em]"
                    style={{
                      opacity: 0.75 + (index % 3) * 0.1,
                    }}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {availability.length > 0 && (
            <section className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Availability
                </p>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {availability.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium capitalize">
                      {slot.dayOfWeek.toLowerCase()}
                    </span>
                    <span className="text-muted-foreground">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tutor.experience && (
            <section className="rounded-2xl border border-border/60 bg-card/70 p-6">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Experience
                </p>
              </div>
              <p className="mt-4 text-2xl font-semibold">
                {tutor.experience}+ years
              </p>
              <p className="text-sm text-muted-foreground">
                of teaching experience
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
