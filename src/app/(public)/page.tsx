import Link from "next/link";
import { Search, Users, Award, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TutorCard from "@/components/modules/tutors/TutorCard";
import { tutorService } from "@/services/tutor.service";

export default async function HomePage() {
  const { data: tutors } = await tutorService.getFeaturedTutors();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              Personalized Learning
            </p>
            <h1 className="mb-6 text-4xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Connect with Expert Tutors
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Find personalized learning experiences with qualified tutors
              across various subjects. Start your learning journey today.
            </p>

            {/* Search Bar */}
            <div className="mx-auto mb-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for tutors, subjects..."
                  className="pl-10"
                />
              </div>
              <Button size="lg">Search</Button>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/tutors">Find a Tutor</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Become a Tutor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-y border-border/60 bg-muted/30 py-16 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <h2 className="mb-12 text-center text-3xl font-semibold text-foreground md:text-4xl">
            Why Choose SkillSync
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-muted/50 p-4">
                <Users className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Expert Tutors</h3>
              <p className="text-muted-foreground">
                Connect with qualified tutors across various subjects
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-muted/50 p-4">
                <Clock className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Flexible Schedule</h3>
              <p className="text-muted-foreground">
                Book sessions at times that work best for you
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-muted/50 p-4">
                <Award className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Quality Learning</h3>
              <p className="text-muted-foreground">
                Personalized 1-on-1 sessions tailored to your needs
              </p>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-muted/50 p-4">
                <TrendingUp className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey and achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border/60 py-20 md:py-24">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1.4fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                The Method
              </p>
              <h2 className="mt-4 text-3xl font-semibold">
                A clean path from search to session
              </h2>
              <p className="mt-4 text-muted-foreground">
                Keep it simple. Browse, compare, and book a tutor in minutes.
                Every step is designed to reduce friction and keep you in
                control.
              </p>
              <div className="mt-8">
                <Button asChild variant="outline">
                  <Link href="/tutors">Explore Tutors</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                {
                  title: "Discover",
                  body: "Filter by subject, rating, and price to find a match.",
                },
                {
                  title: "Book",
                  body: "Choose a time that fits your schedule and confirm.",
                },
                {
                  title: "Learn",
                  body: "Join your session and track progress over time.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tutors Section */}
      {tutors && tutors.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
            <div className="mb-12 flex items-center justify-between">
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
                Featured Tutors
              </h2>
              <Button variant="outline" asChild>
                <Link href="/tutors">View All</Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tutors.slice(0, 6).map((tutor: any) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="border-t border-border/60 py-20">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
          <div className="rounded-3xl border border-border/60 bg-muted/30 px-8 py-14 text-center md:px-14">
            <h2 className="mb-4 text-3xl font-semibold text-foreground md:text-4xl">
              Ready to Start Learning?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of students connecting with expert tutors on
              SkillSync
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/tutors">Browse Tutors</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
