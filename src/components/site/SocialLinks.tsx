import { Mail } from "lucide-react";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { FacebookIcon, GithubIcon, KaggleIcon, LinkedinIcon, XIcon } from "../icons";

export function socialItems(profile: Profile) {
  return [
    { href: profile.github, label: "GitHub", Icon: GithubIcon },
    { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: profile.kaggle, label: "Kaggle", Icon: KaggleIcon },
    { href: profile.twitter, label: "X", Icon: XIcon },
    { href: profile.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: profile.email ? `mailto:${profile.email}` : null, label: "Email", Icon: Mail },
  ].filter((item): item is typeof item & { href: string } => Boolean(item.href));
}

export function SocialLinks({ profile, className }: { profile: Profile; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {socialItems(profile).map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="grid size-10 place-items-center rounded-xl border border-line bg-surface text-muted transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
        >
          <Icon className="size-[18px]" />
        </a>
      ))}
    </div>
  );
}
