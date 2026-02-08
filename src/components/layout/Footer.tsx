import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-muted/40 p-1 overflow-hidden">
                <Image
                  src="/skillsync-logo.png"
                  alt="SkillSync"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain rounded-full"
                />
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.28em] text-foreground/80">
                SkillSync
              </span>
            </div>
            <h3 className="mb-2 text-lg font-semibold">About SkillSync</h3>
            <p className="text-sm text-muted-foreground">
              Connect with expert tutors for personalized learning experiences.
              Find the perfect tutor to help you achieve your educational goals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tutors"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* For Tutors */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">For Tutors</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/register"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Become a Tutor
                </Link>
              </li>
              <li>
                <Link
                  href="/tutor-dashboard"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Tutor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                <span>abdullah.cseruet@gmail.com</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Phone className="mr-2 h-4 w-4" />
                <span>+8801744479359</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                <span>RUET, Rajshahi</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} SkillSync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
