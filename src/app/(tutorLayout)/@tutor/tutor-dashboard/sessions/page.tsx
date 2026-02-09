"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { bookingService } from "@/services/booking.service";
import BookingCard from "@/components/modules/bookings/BookingCard";
import type { Booking } from "@/types";

export default function TutorSessionsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = async () => {
    setIsLoading(true);
    const { data } = await bookingService.getBookings({ limit: 1000 });
    setBookings(Array.isArray(data) ? (data as Booking[]) : []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings
  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.startTime) > now,
  );
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED");
  const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

  const renderBookingList = (bookingList: Booking[], emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      );
    }

    if (bookingList.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4">
        {bookingList.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            userRole="TUTOR"
            onUpdate={fetchBookings}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
      <div>
        <h1 className="text-3xl font-bold">My Sessions</h1>
        <p className="text-muted-foreground">Manage your tutoring sessions</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {renderBookingList(upcomingBookings, "No upcoming sessions")}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {renderBookingList(completedBookings, "No completed sessions")}
        </TabsContent>

        <TabsContent value="cancelled" className="mt-6">
          {renderBookingList(cancelledBookings, "No cancelled sessions")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
