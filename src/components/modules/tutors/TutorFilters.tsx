"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TutorFilters as TutorFiltersType } from "@/types";

interface TutorFiltersProps {
  onFilterChange?: (filters: TutorFiltersType) => void;
  categories?: { id: string; name: string }[];
}

export default function TutorFilters({ onFilterChange, categories = [] }: TutorFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<TutorFiltersType>({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    rating: searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined,
  });

  const handleFilterChange = (key: keyof TutorFiltersType, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "") {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
    
    // Call callback if provided
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters: TutorFiltersType = {
      search: "",
      category: "",
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined,
    };
    setFilters(resetFilters);
    router.push(window.location.pathname, { scroll: false });
    onFilterChange?.(resetFilters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Tutors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Search by name or subject..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Select */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range (per hour)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                Min
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="$0"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)
                }
                min="0"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                Max
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="$200"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)
                }
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Minimum Rating</Label>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleFilterChange("rating", filters.rating === rating ? undefined : rating)
                }
                className="flex items-center justify-center"
              >
                {rating}
                <Star
                  className={`ml-1 h-3 w-3 ${
                    filters.rating === rating
                      ? "fill-primary-foreground text-primary-foreground"
                      : "fill-foreground text-foreground"
                  }`}
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <Button variant="outline" onClick={handleReset} className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
