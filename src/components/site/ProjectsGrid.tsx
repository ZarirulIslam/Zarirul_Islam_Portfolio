"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category).filter((c): c is string => Boolean(c)))],
    [projects],
  );
  const [active, setActive] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);
  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <>
      {categories.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition",
                active === c
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line text-muted hover:border-accent/50 hover:text-fg",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length > 6 && (
        <div className="mt-10 text-center">
          <button type="button" onClick={() => setShowAll((v) => !v)} className="btn-ghost">
            {showAll ? "Show less" : `Show all ${filtered.length} projects`}
          </button>
        </div>
      )}
    </>
  );
}
