"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  Star,
  X,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bookingService } from "@/services/booking.service";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

interface BookingCardProps {
  booking: Booking;
  userRole: "STUDENT" | "TUTOR";
  onUpdate?: () => void;
  onReview?: (bookingId: string) => void;
}

const statusConfig: Record<
  BookingStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  CONFIRMED: { label: "Confirmed", variant: "default" },
  COMPLETED: { label: "Completed", variant: "secondary" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
};

export default function BookingCard({
  booking,
  userRole,
  onUpdate,
  onReview,
}: BookingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine which user info to show based on role
  const displayUser =
    userRole === "STUDENT" ? booking.tutorProfile?.user : booking.student;

  const displayName = displayUser?.name || "Unknown User";
  const displayImage = displayUser?.image;
  const displayRole = userRole === "STUDENT" ? "Tutor" : "Student";

  const startDate = new Date(booking.startTime);
  const endDate = new Date(booking.endTime);
  const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setIsLoading(true);
    try {
      const { error } = await bookingService.cancelBooking(booking.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Booking cancelled successfully");
      onUpdate?.();
    } catch {
      toast.error("Failed to cancel booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!confirm("Mark this booking as completed?")) return;

    setIsLoading(true);
    try {
      const { error } = await bookingService.completeBooking(booking.id);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Booking marked as completed");
      onUpdate?.();
    } catch {
      toast.error("Failed to complete booking");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = () => {
    onReview?.(booking.id);
  };

  const isPastBooking = endDate < new Date();
  const canCancel = booking.status === "CONFIRMED" && !isPastBooking;
  const canComplete =
    userRole === "TUTOR" && booking.status === "CONFIRMED" && isPastBooking;
  const canReview =
    userRole === "STUDENT" && booking.status === "COMPLETED" && onReview;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={displayImage || undefined}
                alt={displayName}
                className="grayscale"
              />
              <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{displayName}</p>
              <p className="text-sm text-muted-foreground">{displayRole}</p>
            </div>
          </div>
          <Badge variant={statusConfig[booking.status].variant}>
            {statusConfig[booking.status].label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(startDate, "PPP")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {format(startDate, "h:mm a")} - {format(endDate, "h:mm a")}
            </span>
          </div>
        </div>

        {/* Duration and Price */}
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Duration: </span>
            <span className="font-medium">
              {duration} hour{duration !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1 text-lg font-bold">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            {formatCurrency(booking.price)}
          </div>
        </div>

        {/* Action Buttons */}
        {(canCancel || canComplete || canReview) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {canCancel && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="mr-1 h-4 w-4" />
                Cancel
              </Button>
            )}

            {canComplete && (
              <Button
                variant="default"
                size="sm"
                onClick={handleComplete}
                disabled={isLoading}
              >
                <CheckCircle className="mr-1 h-4 w-4" />
                Mark Complete
              </Button>
            )}

            {canReview && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReview}
                disabled={isLoading}
              >
                <Star className="mr-1 h-4 w-4" />
                Leave Review
              </Button>
            )}
          </div>
        )}

        {/* Booking ID */}
        <p className="text-xs text-muted-foreground">
          Booking ID: {booking.id.slice(0, 8)}...
        </p>
      </CardContent>
    </Card>
  );
}
