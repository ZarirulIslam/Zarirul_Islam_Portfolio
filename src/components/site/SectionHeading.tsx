import { Reveal } from "./Reveal";

export function SectionHeading({ index, kicker, title, intro }: { index: string; kicker: string; title: string; intro?: string }) {
  return (
    <Reveal className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-sm text-accent">
        <span className="text-muted">{index} /</span> {kicker}
      </p>
      <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-muted">{intro}</p>}
    </Reveal>
  );
}
