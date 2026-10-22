import { Briefcase, GraduationCap, HeartHandshake, MapPin } from "lucide-react";
import type { Experience } from "@/lib/types";
import { Reveal } from "./Reveal";

function Column({ title, items, Icon }: { title: string; items: Experience[]; Icon: typeof Briefcase }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="mb-6 flex items-center gap-3 font-display text-xl font-semibold">
        <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
          <Icon className="size-5" />
        </span>
        {title}
      </h3>
      <ol className="relative ml-5 border-l border-line">
        {items.map((item, i) => (
          <li key={item.id} className="relative pb-8 pl-8 last:pb-0">
            <span className="absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2 border-accent bg-bg" />
            <Reveal delay={i * 0.08}>
              <p className="font-mono text-xs text-accent">
                {item.start_date ?? ""}
                {item.start_date && " — "}
                {item.end_date ?? "Present"}
              </p>
              <h4 className="mt-1.5 font-display text-lg font-semibold">{item.title}</h4>
              <p className="mt-0.5 text-sm text-fg/80">
                {item.organization}
                {item.location && (
                  <span className="ml-2 inline-flex items-center gap-1 text-muted">
                    <MapPin className="size-3" />
                    {item.location}
                  </span>
                )}
              </p>
              {item.description && <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>}
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Timeline({ items }: { items: Experience[] }) {
  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="space-y-12">
        <Column title="Experience" Icon={Briefcase} items={items.filter((i) => i.kind === "work")} />
        <Column title="Leadership & Volunteering" Icon={HeartHandshake} items={items.filter((i) => i.kind === "volunteer")} />
      </div>
      <Column title="Education" Icon={GraduationCap} items={items.filter((i) => i.kind === "education")} />
    </div>
  );
}
