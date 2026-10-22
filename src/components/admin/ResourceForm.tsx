"use client";

import { CheckCircle2, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";
import type { Field } from "@/lib/resources";
import { cn } from "@/lib/utils";
import { FieldInput } from "./fields";

export function ResourceForm({
  fields,
  values,
  action,
  cancelHref,
}: {
  fields: Field[];
  values: Record<string, unknown>;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  cancelHref?: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="card p-6 sm:p-8">
      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={cn((field.wide || field.type === "boolean") && "md:col-span-2")}>
            <FieldInput field={field} value={values[field.name] as never} />
          </div>
        ))}
      </div>

      {state.error && <p className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{state.error}</p>}
      {state.ok && !pending && (
        <p className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500">
          <CheckCircle2 className="size-4" /> Saved. The live site has been updated.
        </p>
      )}

      <div className="mt-8 flex items-center gap-3 border-t border-line pt-6">
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {pending ? "Saving..." : "Save"}
        </button>
        {cancelHref && (
          <Link href={cancelHref} className="btn-ghost">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
