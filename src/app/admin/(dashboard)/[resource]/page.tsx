import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteItem } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { getAdmin } from "@/lib/auth";
import { resources, type Resource } from "@/lib/resources";

type Props = { params: Promise<{ resource: string }> };

function Cell({ column, value }: { column: Resource["columns"][number]; value: unknown }) {
  switch (column.type) {
    case "boolean":
      return value ? <Check className="size-4 text-emerald-500" /> : <span className="text-muted">—</span>;
    case "tags":
      return (
        <div className="flex flex-wrap gap-1">
          {(value as string[] | null)?.slice(0, 3).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      );
    case "badge":
      return value ? <span className="chip">{String(value)}</span> : null;
    default:
      return <>{value == null || value === "" ? "—" : String(value)}</>;
  }
}

export default async function ResourceListPage({ params }: Props) {
  const resource = resources[(await params).resource];
  if (!resource) notFound();

  const { supabase } = await getAdmin();
  let query = supabase.from(resource.table).select("*");
  for (const [column, ascending] of resource.order) query = query.order(column, { ascending });
  const { data, error } = await query;
  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <>
      <PageHeader title={resource.label} description={resource.description}>
        <Link href={`/admin/${resource.key}/new`} className="btn-primary">
          <Plus className="size-4" /> New {resource.singular.toLowerCase()}
        </Link>
      </PageHeader>

      {error && <p className="mb-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error.message}</p>}

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line text-xs tracking-wide text-muted uppercase">
            <tr>
              {resource.columns.map((c) => (
                <th key={c.name} className="px-5 py-3 font-semibold">
                  {c.label}
                </th>
              ))}
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) => (
              <tr key={String(row.id)} className="hover:bg-surface-2/60">
                {resource.columns.map((c, i) => (
                  <td key={c.name} className="px-5 py-3.5">
                    {i === 0 ? (
                      <Link href={`/admin/${resource.key}/${row.id}`} className="font-medium hover:text-accent">
                        <Cell column={c} value={row[c.name]} />
                      </Link>
                    ) : (
                      <Cell column={c} value={row[c.name]} />
                    )}
                  </td>
                ))}
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/${resource.key}/${row.id}`} title="Edit" className="text-muted hover:text-accent">
                      <Pencil className="size-4" />
                    </Link>
                    <form action={deleteItem.bind(null, resource.key, String(row.id))}>
                      <ConfirmButton title="Delete" message={`Delete this ${resource.singular.toLowerCase()}?`}>
                        <Trash2 className="size-4" />
                      </ConfirmButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={resource.columns.length + 1} className="px-5 py-12 text-center text-muted">
                  Nothing here yet.{" "}
                  <Link href={`/admin/${resource.key}/new`} className="text-accent hover:underline">
                    Add the first one
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
