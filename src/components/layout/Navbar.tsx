"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ModeToggle from "./ModeToggle";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/";
    return "/dashboard-redirect";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-muted/40 p-1 overflow-hidden">
              <Image
                src="/skillsync-logo.png"
                alt="SkillSync"
                width={28}
                height={28}
                className="h-7 w-7 object-contain rounded-full"
                priority
              />
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/80 transition-colors group-hover:text-foreground">
              SkillSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="relative text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all hover:after:w-full"
            >
              Home
            </Link>
            <Link
              href="/tutors"
              className="relative text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all hover:after:w-full"
            >
              Find Tutors
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  asChild
                  className="hidden sm:inline-flex"
                >
                  <Link href={getDashboardLink()}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user?.image || undefined}
                          alt={user?.name}
                        />
                        <AvatarFallback className="bg-muted">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => logout()}
                      className="flex items-center"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Button variant="ghost" asChild className="px-4">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="px-5">
                  <Link href="/register">Sign up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="px-6 py-6">
                <SheetHeader className="px-0 pb-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/"
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Home
                  </Link>
                  <Link
                    href="/tutors"
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Find Tutors
                  </Link>

                  {isAuthenticated ? (
                    <>
                      <div className="my-2 border-t pt-4 px-3">
                        <p className="mb-1 text-sm font-semibold">
                          {user?.name}
                        </p>
                        <p className="mb-2 text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        asChild
                        className="w-full justify-start px-3 py-2.5 h-auto"
                      >
                        <Link href={getDashboardLink()}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        className="w-full justify-start px-3 py-2.5 h-auto"
                      >
                        <Link href="/dashboard/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => logout()}
                        className="w-full justify-start px-3 py-2.5 h-auto"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2 border-t pt-4 mt-2">
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/register">Sign up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
