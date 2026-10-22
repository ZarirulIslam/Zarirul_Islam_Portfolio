import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteItem, saveItem } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { PageHeader } from "@/components/admin/PageHeader";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { getAdmin } from "@/lib/auth";
import { resources } from "@/lib/resources";

type Props = { params: Promise<{ resource: string; id: string }> };

const defaults: Record<string, Record<string, unknown>> = {
  skills: { level: 70 },
  experience: { kind: "work" },
  certifications: { kind: "certification" },
  posts: { published: false },
};

export default async function ResourceEditPage({ params }: Props) {
  const { resource: key, id } = await params;
  const resource = resources[key];
  if (!resource) notFound();

  const isNew = id === "new";
  let values: Record<string, unknown> = defaults[key] ?? {};

  if (!isNew) {
    const { supabase } = await getAdmin();
    const { data } = await supabase.from(resource.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    values = data;
  }

  const listHref = `/admin/${resource.key}`;

  return (
    <>
      <Link href={listHref} className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
        <ArrowLeft className="size-4" /> {resource.label}
      </Link>
      <PageHeader title={isNew ? `New ${resource.singular.toLowerCase()}` : `Edit ${resource.singular.toLowerCase()}`}>
        {!isNew && (
          <form action={deleteItem.bind(null, resource.key, id)}>
            <ConfirmButton className="btn-ghost hover:border-red-500" message={`Delete this ${resource.singular.toLowerCase()}?`}>
              <Trash2 className="size-4" /> Delete
            </ConfirmButton>
          </form>
        )}
      </PageHeader>
      <ResourceForm
        fields={resource.fields}
        values={values}
        action={saveItem.bind(null, resource.key, isNew ? null : id)}
        cancelHref={listHref}
      />
    </>
  );
}
