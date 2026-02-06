import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { TutorProfile } from "@/types";

interface TutorCardProps {
  tutor: TutorProfile;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  const displayName = tutor.user?.name || "Tutor";
  const displayImage = tutor.user?.image;
  const hourlyRate = tutor.hourlyRate || 0;
  const ratingAvg = tutor.ratingAvg || 0;
  const ratingCount = tutor.ratingCount || 0;
  const categories = tutor.categories || [];

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
        />
      );
    }
    return stars;
  };

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage 
              src={displayImage || undefined} 
              alt={displayName}
              className="grayscale"
            />
            <AvatarFallback className="bg-muted text-lg font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Name and Rating */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground">{displayName}</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {renderStars()}
              </div>
              <span className="text-sm text-muted-foreground">
                ({ratingCount})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        {tutor.bio && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {tutor.bio}
          </p>
        )}

        {/* Categories/Subjects */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.slice(0, 3).map((category, index) => (
              <Badge
                key={category.id}
                variant="secondary"
                className={`
                  ${index === 0 ? "bg-muted/30 text-foreground" : ""}
                  ${index === 1 ? "bg-muted/50 text-foreground" : ""}
                  ${index === 2 ? "bg-muted/70 text-foreground" : ""}
                `}
              >
                {category.name}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge variant="outline" className="text-muted-foreground">
                +{categories.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Hourly Rate */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">
            {formatCurrency(hourlyRate)}
          </span>
          <span className="text-sm text-muted-foreground">/hour</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
