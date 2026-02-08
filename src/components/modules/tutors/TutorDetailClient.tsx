"use client";

import { useState } from "react";
import BookingModal from "@/components/modules/bookings/BookingModal";
import TutorProfile from "@/components/modules/tutors/TutorProfile";
import type { TutorProfile as TutorProfileType, Review } from "@/types";

interface TutorDetailClientProps {
  tutor: TutorProfileType;
  reviews?: Review[];
}

export default function TutorDetailClient({
  tutor,
  reviews = [],
}: TutorDetailClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <TutorProfile
        tutor={tutor}
        reviews={reviews}
        onBookSession={() => setIsBookingOpen(true)}
      />
      <BookingModal
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        tutor={tutor}
      />
    </>
  );
}
