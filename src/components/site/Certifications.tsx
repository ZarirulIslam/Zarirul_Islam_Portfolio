"use client";

import { Award, BadgeCheck, ExternalLink, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Certification } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs = [
  { key: "certification", label: "Certifications", Icon: BadgeCheck },
  { key: "achievement", label: "Achievements", Icon: Trophy },
] as const;

export function Certifications({ items }: { items: Certification[] }) {
  const available = tabs.filter((t) => items.some((i) => i.kind === t.key));
  const [active, setActive] = useState<Certification["kind"]>(available[0]?.key ?? "certification");
  const [category, setCategory] = useState("All");

  const ofKind = items.filter((i) => i.kind === active);
  const categories = useMemo(
    () => ["All", ...new Set(ofKind.map((i) => i.category).filter((c): c is string => Boolean(c)))],
    [ofKind],
  );
  const visible = category === "All" ? ofKind : ofKind.filter((i) => i.category === category);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {available.length > 1 && (
          <div className="inline-flex w-fit rounded-xl border border-line bg-surface p-1">
            {available.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActive(key);
                  setCategory("All");
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition",
                  active === key ? "bg-accent-soft text-accent" : "text-muted hover:text-fg",
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {categories.length > 2 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm transition",
                  category === c
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line text-muted hover:border-accent/50 hover:text-fg",
                )}
              >
                {c}
                <span className="ml-1.5 font-mono text-xs opacity-60">
                  {c === "All" ? ofKind.length : ofKind.filter((i) => i.category === c).length}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((item) => (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="card group flex flex-col overflow-hidden transition hover:border-accent/50"
            >
              {item.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={item.title} className="aspect-[16/10] w-full border-b border-line object-cover" />
              )}
              <div className="flex flex-1 flex-col p-5">
                {item.category && <p className="mb-3 font-mono text-xs text-accent">{item.category}</p>}
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                    {item.kind === "achievement" ? <Trophy className="size-5" /> : <Award className="size-5" />}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display leading-snug font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted">
                      {item.issuer}
                      {item.issuer && item.date && " · "}
                      {item.date}
                    </p>
                  </div>
                </div>
                {item.description && <p className="mt-3 text-sm text-muted">{item.description}</p>}
                {item.credential_url && (
                  <a
                    href={item.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-accent hover:underline"
                  >
                    View credential <ExternalLink className="size-3.5" />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
