"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, DollarSign, Briefcase, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { userService } from "@/services/user.service";
import { tutorService } from "@/services/tutor.service";
import { adminService } from "@/services/admin.service";
import type { User, Category } from "@/types";

const normalizeArray = <T,>(input: unknown): T[] => {
  if (Array.isArray((input as { data?: unknown })?.data)) {
    return (input as { data: T[] }).data;
  }
  if (Array.isArray(input)) {
    return input as T[];
  }
  return [];
};

export default function TutorProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    bio: "",
    hourlyRate: "",
    experience: "",
    categoryIds: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      // Fetch user profile
      const { data: userData, error: userError } =
        await userService.getCurrentUserProfile();

      if (userError) {
        toast.error("Failed to load profile");
        return;
      }

      // Fetch categories
      const { data: categoriesData } = await adminService.getAllCategories();
      setCategories(normalizeArray<Category>(categoriesData));

      if (userData) {
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          image: userData.image || "",
          bio: userData.tutorProfile?.bio || "",
          hourlyRate: userData.tutorProfile?.hourlyRate?.toString() || "",
          experience: userData.tutorProfile?.experience?.toString() || "",
          categoryIds:
            userData.tutorProfile?.categories
              ?.map((c: { id?: string; category?: { id?: string } }) =>
                c.category?.id || c.id || "",
              )
              .filter(Boolean) || [],
        });
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Update user profile
      const { error: userError } = await userService.updateProfile({
        name: formData.name,
        phone: formData.phone || undefined,
        image: formData.image || undefined,
      });

      if (userError) {
        toast.error(userError.message);
        setIsSaving(false);
        return;
      }

      // Update tutor profile
      const { error: tutorError } = await tutorService.updateTutorProfile({
        bio: formData.bio || undefined,
        hourlyRate: formData.hourlyRate
          ? Number(formData.hourlyRate)
          : undefined,
        experience: formData.experience
          ? Number(formData.experience)
          : undefined,
        categoryIds:
          formData.categoryIds.length > 0 ? formData.categoryIds : undefined,
      });

      if (tutorError) {
        toast.error(tutorError.message);
        setIsSaving(false);
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
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
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-6">
      <div>
        <h1 className="text-3xl font-bold">Tutor Profile</h1>
        <p className="text-muted-foreground">
          Manage your professional information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 border-4 border-muted">
                <AvatarImage
                  src={formData.image || undefined}
                  alt={formData.name}
                  className="grayscale"
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(formData.name || "Tutor")}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isSaving}
                required
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={isSaving}
                placeholder="+1 234 567 8900"
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="image">Avatar URL (Optional)</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                disabled={isSaving}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                disabled={isSaving}
                placeholder="Tell students about yourself, your teaching style, and experience..."
                rows={6}
              />
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">
                <DollarSign className="mr-2 inline h-4 w-4" />
                Hourly Rate (USD)
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourlyRate}
                onChange={(e) =>
                  setFormData({ ...formData, hourlyRate: e.target.value })
                }
                disabled={isSaving}
                placeholder="50.00"
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">
                <Briefcase className="mr-2 inline h-4 w-4" />
                Years of Experience
              </Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                disabled={isSaving}
                placeholder="5"
              />
            </div>

            {/* Subjects/Categories */}
            <div className="space-y-2">
              <Label>
                <BookOpen className="mr-2 inline h-4 w-4" />
                Subjects/Expertise
              </Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isSelected = formData.categoryIds.includes(category.id);
                  return (
                    <Badge
                      key={category.id}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => !isSaving && toggleCategory(category.id)}
                    >
                      {category.name}
                    </Badge>
                  );
                })}
              </div>
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No categories available
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" disabled={isSaving} size="lg" className="w-full">
          <Save className="mr-2 h-5 w-5" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
