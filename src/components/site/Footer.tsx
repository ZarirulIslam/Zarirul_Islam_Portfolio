import { ArrowUp } from "lucide-react";
import type { Profile } from "@/lib/types";
import { Logo } from "../Logo";
import { SocialLinks } from "./SocialLinks";

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-left">
          <Logo className="mx-auto h-6 sm:mx-0" />
          <p className="mt-3 text-sm text-muted">
            © {new Date().getFullYear()} · Built with Next.js & Supabase
          </p>
        </div>
        <SocialLinks profile={profile} />
        <a
          href="#top"
          aria-label="Back to top"
          className="grid size-10 place-items-center rounded-xl border border-line text-muted transition hover:border-accent hover:text-accent"
        >
          <ArrowUp className="size-4" />
        </a>
      </div>
    </footer>
  );
}
