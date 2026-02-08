import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import type { TutorProfile, Category } from "@/types";

interface TutorCardProps {
  tutor: TutorProfile;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const displayName = tutor.user?.name || "Tutor";
  const displayImage = tutor.user?.image;
  const hourlyRate = tutor.hourlyRate || 0;
  const ratingAvg = tutor.ratingAvg || 0;
  const ratingCount = tutor.ratingCount || 0;
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

  // Render star rating (monochrome)
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= Math.round(ratingAvg)
              ? "fill-foreground text-foreground"
              : "fill-muted text-muted"
          }`}
        />,
      );
    }
    return stars;
  };

  return (
    <article className="group relative grid grid-rows-[auto_1fr_auto] overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-b from-background/80 via-card/85 to-muted/40 p-7 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-28px_rgba(15,23,42,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_60%)] opacity-70" />

      <header className="relative">
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
          Tutor
        </p>
        <div className="mt-4 flex items-center gap-5">
          <Avatar className="h-16 w-16 border border-border/70 shadow-sm">
            <AvatarImage
              src={displayImage || undefined}
              alt={displayName}
              className="grayscale"
            />
            <AvatarFallback className="bg-muted text-lg font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="text-xl font-semibold text-foreground">
              {displayName}
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="flex items-center gap-0.5">{renderStars()}</div>
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {ratingAvg.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({ratingCount})
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative min-h-0 pt-5">
        <p className="text-sm text-muted-foreground">
          {tutor.bio || "Focused, structured sessions tailored to your goals."}
        </p>

        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.slice(0, 3).map((category, index) => (
              <Badge
                key={`${category.id}-${index}`}
                variant="secondary"
                className={`text-[0.6rem] uppercase tracking-[0.2em] ${
                  index === 0 ? "bg-muted/30 text-foreground" : ""
                } ${index === 1 ? "bg-muted/50 text-foreground" : ""} ${
                  index === 2 ? "bg-muted/70 text-foreground" : ""
                }`}
              >
                {category.name}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge
                variant="outline"
                className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground"
              >
                +{categories.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      <footer className="relative mt-6 border-t border-border/60 pt-5">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold text-foreground">
            {formatCurrency(hourlyRate)}
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
            /hour
          </span>
        </div>
        <Button asChild size="sm" className="mt-5 w-full">
          <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
        </Button>
      </footer>
    </article>
  );
}
