"use client";

import { motion } from "motion/react";
import { BarChart3, BrainCircuit, Code2, Database, Globe, LineChart, Wrench } from "lucide-react";
import { useMemo, useState } from "react";
import type { Skill } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, typeof Code2> = {
  programming: Code2,
  "data analysis": LineChart,
  visualization: BarChart3,
  "machine learning": BrainCircuit,
  "tools & databases": Database,
  "data science & ml": BrainCircuit,
  "data science & machine learning": BrainCircuit,
  databases: Database,
  "web technologies": Globe,
  "web development": Globe,
  tools: Wrench,
};

function iconFor(category: string) {
  return categoryIcons[category.toLowerCase()] ?? Wrench;
}

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const categories = useMemo(() => {
    const map = new Map<string, Skill[]>();
    for (const s of skills) map.set(s.category, [...(map.get(s.category) ?? []), s]);
    return [...map.entries()];
  }, [skills]);
  const [active, setActive] = useState("All");

  const visible = active === "All" ? categories : categories.filter(([c]) => c === active);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {["All", ...categories.map(([c]) => c)].map((c) => (
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

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map(([category, items], ci) => {
          const Icon = iconFor(category);
          return (
            <motion.div
              key={category}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.06 }}
              className="card p-6 transition hover:border-accent/50"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="size-5" />
                </span>
                <h3 className="font-display text-lg font-semibold">{category}</h3>
              </div>
              <ul className="space-y-4">
                {items.map((s) => (
                  <li key={s.id}>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>{s.name}</span>
                      <span className="font-mono text-xs text-muted">{s.level}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
                      <motion.div
                        className="h-full rounded-full bg-linear-to-r from-accent to-accent-2"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
