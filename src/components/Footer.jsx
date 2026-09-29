"use client";

import Link from "next/link";
import {
  BookOpen,
  Mail,
  ArrowUp,
  Heart,
  ExternalLink,
  MessageCircle,
  BriefcaseBusiness,
} from "lucide-react";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-divider bg-background">
      {/* ================= MAIN FOOTER ================= */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* ================= BRAND ================= */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>

              <span>
                Biblio<span className="text-primary">Drop</span>
              </span>
            </Link>

            {/* Description */}
            <p className="mt-4 max-w-md text-sm leading-6 text-foreground/55">
              Discover, explore, and manage your favorite books with
              BiblioDrop. A simple and modern platform built for readers
              and libraries.
            </p>

            {/* Social / External Links */}
            <div className="mt-6 flex items-center gap-2">
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-default-100 text-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-default-100 text-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-default-100 text-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary"
              >
                <BriefcaseBusiness className="h-4 w-4" />
              </a>

              {/* Email */}
              <a
                href="mailto:hello@bibliodrop.com"
                aria-label="Email"
                title="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-default-100 text-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* ================= QUICK LINKS ================= */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-foreground/55 transition-colors hover:text-primary"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/browse-books"
                  className="text-sm text-foreground/55 transition-colors hover:text-primary"
                >
                  Browse Books
                </Link>
              </li>

              <li>
                <Link
                  href="/login"
                  className="text-sm text-foreground/55 transition-colors hover:text-primary"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  href="/register"
                  className="text-sm text-foreground/55 transition-colors hover:text-primary"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* ================= SUPPORT ================= */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Support
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-foreground/55 transition-colors hover:text-primary"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-foreground/55 transition-colors hover:text-primary"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-foreground/55 transition-colors hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-sm text-foreground/55 transition-colors hover:text-primary"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ================= BOTTOM ================= */}
        <div className="mt-12 border-t border-divider pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

            {/* Copyright */}
            <p className="text-center text-xs text-foreground/45 sm:text-left">
              © {currentYear} BiblioDrop. All rights reserved.
            </p>

            {/* Built With */}
            <p className="flex items-center gap-1 text-xs text-foreground/45">
              Built with
              <span className="font-medium text-primary">
                Next.js
              </span>

              <span>·</span>

              <span className="font-medium text-primary">
                Tailwind CSS
              </span>
            </p>

            {/* Back To Top */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-default-100 text-foreground/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/10 hover:text-primary"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom Text */}
          <div className="mt-6 flex items-center justify-center gap-1 text-center text-xs text-foreground/40">
            Made with
            <Heart className="h-3.5 w-3.5 text-danger" />
            for book lovers
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;