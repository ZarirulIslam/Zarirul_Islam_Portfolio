"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

/** Submit button that asks for confirmation first. Place inside a <form action={...}>. */
export function ConfirmButton({
  children,
  message = "Are you sure? This cannot be undone.",
  className,
  title,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      title={title}
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={cn("inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-red-500", className)}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </button>
  );
}

export function SubmitButton({ children, className, title }: { children: React.ReactNode; className?: string; title?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} title={title} className={className}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : children}
    </button>
  );
}
