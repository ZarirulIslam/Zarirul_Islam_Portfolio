"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const allLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "certifications", label: "Certifications" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export function Navbar({ name, resumeUrl, hasPosts }: { name: string; resumeUrl: string | null; hasPosts: boolean }) {
  const pathname = usePathname();
  const links = useMemo(() => (hasPosts ? allLinks : allLinks.filter((l) => l.id !== "blog")), [hasPosts]);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view (home page only)
  useEffect(() => {
    if (pathname !== "/") {
      setActive(pathname.startsWith("/blog") ? "blog" : pathname.startsWith("/projects") ? "projects" : "");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname, links]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label={`${name}, home`} className="flex items-center transition-opacity hover:opacity-80">
          <Logo className="h-6 sm:h-7" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={id === "blog" ? "/blog" : `/#${id}`}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  active === id ? "text-accent" : "text-muted hover:text-fg",
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary hidden px-4! py-2! sm:inline-flex">
              Resume
            </a>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid size-9 place-items-center rounded-xl border border-line bg-surface lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line lg:hidden">
          <ul className="container-x grid gap-1 py-4">
            {links.map(({ id, label }) => (
              <li key={id}>
                <Link
                  href={id === "blog" ? "/blog" : `/#${id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm",
                    active === id ? "bg-accent-soft text-accent" : "text-muted hover:text-fg",
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
            {resumeUrl && (
              <li className="pt-2">
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                  Download Resume
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
