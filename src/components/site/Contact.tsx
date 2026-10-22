"use client";

import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { sendMessage, type ContactState } from "@/app/actions";
import type { Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SocialLinks } from "./SocialLinks";

const initial: ContactState = { status: "idle", message: "" };

export function Contact({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(sendMessage, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  const info = [
    profile.email && { Icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    profile.phone && { Icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` },
    profile.location && { Icon: MapPin, label: "Location", value: profile.location },
  ].filter(Boolean) as { Icon: typeof Mail; label: string; value: string; href?: string }[];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <div className="card relative overflow-hidden p-8">
        <div className="glow-blob -top-16 -right-16 size-56 bg-accent/30" />
        <h3 className="relative font-display text-2xl font-semibold">Let&apos;s work together</h3>
        <p className="relative mt-3 text-muted">
          Hiring for a data or machine learning role, working on a research idea, or have a dataset that needs answers? My inbox is always open.
        </p>
        <ul className="relative mt-8 space-y-5">
          {info.map(({ Icon, label, value, href }) => (
            <li key={label} className="flex items-center gap-4">
              <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted">{label}</p>
                {href ? (
                  <a href={href} className="break-all font-medium hover:text-accent">
                    {value}
                  </a>
                ) : (
                  <p className="font-medium">{value}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
        <SocialLinks profile={profile} className="relative mt-8" />
      </div>

      <form ref={formRef} action={action} className="card space-y-5 p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="label">
              Name
            </label>
            <input id="name" name="name" required maxLength={120} className="input" placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input id="email" name="email" type="email" required maxLength={200} className="input" placeholder="you@email.com" />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="label">
            Subject
          </label>
          <input id="subject" name="subject" maxLength={200} className="input" placeholder="What's this about?" />
        </div>
        <div>
          <label htmlFor="message" className="label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            maxLength={5000}
            className="input resize-y"
            placeholder="Tell me about your project..."
          />
        </div>
        {/* Honeypot field for bots */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        {state.status !== "idle" && (
          <p
            role="status"
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-3 text-sm",
              state.status === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500",
            )}
          >
            {state.status === "success" && <CheckCircle2 className="size-4" />}
            {state.message}
          </p>
        )}

        <button type="submit" disabled={pending} className="btn-primary w-full sm:w-auto">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {pending ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}
