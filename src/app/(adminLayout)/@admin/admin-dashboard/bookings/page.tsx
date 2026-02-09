"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Filter, Eye } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { adminService } from "@/services/admin.service";
import type { Booking } from "@/types";

const normalizeArray = <T,>(input: unknown): T[] => {
  if (Array.isArray((input as { data?: unknown })?.data)) {
    return (input as { data: T[] }).data;
  }
  if (Array.isArray(input)) {
    return input as T[];
  }
  return [];
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    const { data, error } = await adminService.getAllBookings({ limit: 1000 });

    if (error) {
      toast.error("Failed to fetch bookings");
    } else {
      const safeBookings = normalizeArray<Booking>(data);
      setBookings(safeBookings);
      setFilteredBookings(safeBookings);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on status
  useEffect(() => {
    let filtered = bookings;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [statusFilter, bookings]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "default";
      case "COMPLETED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const viewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <p className="text-muted-foreground">
          Monitor all tutoring sessions on the platform
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Bookings ({filteredBookings.length} of {bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => {
                  const duration =
                    (new Date(booking.endTime).getTime() -
                      new Date(booking.startTime).getTime()) /
                    (1000 * 60 * 60);

                  return (
                    <TableRow key={booking.id}>
                      {/* Booking ID */}
                      <TableCell className="font-mono text-sm">
                        #{booking.id.slice(0, 8)}
                      </TableCell>

                      {/* Student */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={booking.student?.image || undefined}
                              alt={booking.student?.name}
                              className="grayscale"
                            />
                            <AvatarFallback className="text-xs">
                              {booking.student?.name
                                ? getInitials(booking.student.name)
                                : "ST"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {booking.student?.name || "Unknown"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Tutor */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                booking.tutorProfile?.user?.image || undefined
                              }
                              alt={booking.tutorProfile?.user?.name}
                              className="grayscale"
                            />
                            <AvatarFallback className="text-xs">
                              {booking.tutorProfile?.user?.name
                                ? getInitials(booking.tutorProfile.user.name)
                                : "TU"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {booking.tutorProfile?.user?.name || "Unknown"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Date & Time */}
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium">
                            {format(new Date(booking.startTime), "MMM d, yyyy")}
                          </p>
                          <p className="text-muted-foreground">
                            {format(new Date(booking.startTime), "h:mm a")}
                          </p>
                        </div>
                      </TableCell>

                      {/* Duration */}
                      <TableCell>{duration.toFixed(1)}h</TableCell>

                      {/* Price */}
                      <TableCell className="font-semibold">
                        ${booking.price.toFixed(2)}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewDetails(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label>Booking ID</Label>
                  <p className="font-mono text-sm">{selectedBooking.id}</p>
                </div>

                <div>
                  <Label>Student</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedBooking.student?.image || undefined}
                        alt={selectedBooking.student?.name}
                        className="grayscale"
                      />
                      <AvatarFallback>
                        {selectedBooking.student?.name
                          ? getInitials(selectedBooking.student.name)
                          : "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedBooking.student?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedBooking.student?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Tutor</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          selectedBooking.tutorProfile?.user?.image || undefined
                        }
                        alt={selectedBooking.tutorProfile?.user?.name}
                        className="grayscale"
                      />
                      <AvatarFallback>
                        {selectedBooking.tutorProfile?.user?.name
                          ? getInitials(selectedBooking.tutorProfile.user.name)
                          : "TU"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedBooking.tutorProfile?.user?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedBooking.tutorProfile?.user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Session Time</Label>
                  <p className="mt-1">
                    {format(new Date(selectedBooking.startTime), "PPP 'at' p")}{" "}
                    - {format(new Date(selectedBooking.endTime), "p")}
                  </p>
                </div>

                <div>
                  <Label>Price</Label>
                  <p className="mt-1 text-lg font-semibold">
                    ${selectedBooking.price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant={getStatusBadgeVariant(selectedBooking.status)}
                    >
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label>Created At</Label>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {format(new Date(selectedBooking.createdAt), "PPP 'at' p")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
