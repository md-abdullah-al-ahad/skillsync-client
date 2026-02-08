import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const studentName = review.student?.name || "Anonymous";
  const studentImage = review.student?.image;
  const reviewDate = new Date(review.createdAt);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          {/* Student Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={studentImage || undefined}
                  alt={studentName}
                  className="grayscale"
                />
                <AvatarFallback>{getInitials(studentName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{studentName}</p>
                <div className="flex items-center gap-1">
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
              {reviewDate.toLocaleDateString()}
            </span>
          </div>

          {/* Review Comment */}
          {review.comment && (
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
