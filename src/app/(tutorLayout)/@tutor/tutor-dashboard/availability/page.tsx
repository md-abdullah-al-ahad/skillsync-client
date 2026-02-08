"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { tutorService } from "@/services/tutor.service";
import type { AvailabilitySlot, DayOfWeek } from "@/types";

const DAYS_OF_WEEK: DayOfWeek[] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

export default function TutorAvailabilityPage() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: "" as DayOfWeek | "",
    startTime: "",
    endTime: "",
  });

  const fetchAvailability = async () => {
    setIsLoading(true);
    const { data, error } = await tutorService.getAvailability();
    if (error) {
      toast.error("Failed to load availability");
    } else {
      const availabilityData = Array.isArray((data as any)?.data)
        ? (data as any).data
        : Array.isArray(data)
          ? data
          : [];
      setAvailability(availabilityData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSlot.dayOfWeek || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    const { error } = await tutorService.addAvailability({
      dayOfWeek: newSlot.dayOfWeek,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Availability added successfully");
      setNewSlot({ dayOfWeek: "", startTime: "", endTime: "" });
      fetchAvailability();
    }
    setIsSaving(false);
  };

  const handleDeleteSlot = async (id: string) => {
    if (!confirm("Are you sure you want to delete this time slot?")) return;

    const { error } = await tutorService.deleteAvailability(id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Availability deleted successfully");
      fetchAvailability();
    }
  };

  // Group availability by day
  const groupedAvailability = DAYS_OF_WEEK.reduce(
    (acc, day) => {
      acc[day] = availability.filter((slot) => slot.dayOfWeek === day);
      return acc;
    },
    {} as Record<DayOfWeek, AvailabilitySlot[]>,
  );

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Availability</h1>
        <p className="text-muted-foreground">
          Set your weekly schedule for tutoring sessions
        </p>
      </div>

      {/* Add New Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Time Slot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Day of Week */}
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Day</Label>
                <Select
                  value={newSlot.dayOfWeek}
                  onValueChange={(value) =>
                    setNewSlot({ ...newSlot, dayOfWeek: value as DayOfWeek })
                  }
                  disabled={isSaving}
                >
                  <SelectTrigger id="dayOfWeek">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {DAY_LABELS[day]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Time */}
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                  disabled={isSaving}
                />
              </div>

              {/* End Time */}
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                  disabled={isSaving}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSaving}>
              <Plus className="mr-2 h-4 w-4" />
              {isSaving ? "Adding..." : "Add Time Slot"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Current Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availability.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                No availability set. Add time slots above to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {DAYS_OF_WEEK.map((day) => {
                const slots = groupedAvailability[day];
                if (slots.length === 0) return null;

                return (
                  <div key={day}>
                    <h3 className="mb-3 font-semibold">{DAY_LABELS[day]}</h3>
                    <div className="space-y-2">
                      {slots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSlot(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
