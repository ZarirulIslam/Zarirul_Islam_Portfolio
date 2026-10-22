"use client";

import { FileText, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Markdown } from "@/components/site/Markdown";
import type { Field } from "@/lib/resources";
import { createClient } from "@/lib/supabase/client";
import { cn, toDirectImageUrl } from "@/lib/utils";

type Value = string | number | boolean | string[] | null | undefined;

export function FieldInput({ field, value }: { field: Field; value: Value }) {
  const id = `f-${field.name}`;

  if (field.type === "boolean") {
    return (
      <label htmlFor={id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
        <input id={id} name={field.name} type="checkbox" defaultChecked={Boolean(value)} className="peer sr-only" />
        <span className="relative h-6 w-11 shrink-0 rounded-full bg-line transition peer-checked:bg-accent after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
        <span className="text-sm">{field.label}</span>
      </label>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="label">
        {field.label}
        {field.required && <span className="text-accent"> *</span>}
      </label>
      <Control field={field} id={id} value={value} />
      {field.help && <p className="mt-1.5 text-xs text-muted">{field.help}</p>}
    </div>
  );
}

function Control({ field, id, value }: { field: Field; id: string; value: Value }) {
  const str = Array.isArray(value) ? value.join(", ") : value == null ? "" : String(value);

  switch (field.type) {
    case "textarea":
      return <textarea id={id} name={field.name} defaultValue={str} rows={3} placeholder={field.placeholder} className="input resize-y" />;
    case "markdown":
      return <MarkdownField id={id} name={field.name} defaultValue={str} />;
    case "select":
      return (
        <select id={id} name={field.name} defaultValue={str || field.options?.[0]?.value} className="input">
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case "image":
    case "file":
      return <UploadField id={id} name={field.name} defaultValue={str} kind={field.type} />;
    case "number":
      return <input id={id} name={field.name} type="number" defaultValue={str || 0} className="input" />;
    default:
      return (
        <>
          <input
            id={id}
            name={field.name}
            type={field.type === "url" ? "url" : field.type === "email" ? "email" : "text"}
            defaultValue={str}
            placeholder={field.placeholder}
            required={field.required}
            list={field.suggestions ? `${id}-list` : undefined}
            className="input"
          />
          {field.suggestions && (
            <datalist id={`${id}-list`}>
              {field.suggestions.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          )}
        </>
      );
  }
}

function MarkdownField({ id, name, defaultValue }: { id: string; name: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface-2 focus-within:border-accent">
      <div className="flex items-center gap-1 border-b border-line px-2 py-1.5">
        {(["write", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn("rounded-lg px-3 py-1 text-xs capitalize", tab === t ? "bg-surface text-fg shadow-sm" : "text-muted")}
          >
            {t}
          </button>
        ))}
        <span className="ml-auto pr-2 text-[11px] text-muted">Markdown supported</span>
      </div>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={14}
        className={cn("block w-full resize-y bg-transparent p-4 font-mono text-sm outline-none", tab === "preview" && "hidden")}
      />
      {tab === "preview" && (
        <div className="min-h-[200px] p-4">
          {value ? <Markdown>{value}</Markdown> : <p className="text-sm text-muted">Nothing to preview.</p>}
        </div>
      )}
    </div>
  );
}

function UploadField({
  id,
  name,
  defaultValue,
  kind,
}: {
  id: string;
  name: string;
  defaultValue: string;
  kind: "image" | "file";
}) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError("File is larger than 10 MB.");
      return;
    }
    setUploading(true);
    setError(null);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const path = `${kind === "image" ? "images" : "files"}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const supabase = createClient();
    const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) setError(error.message);
    else setUrl(supabase.storage.from("media").getPublicUrl(path).data.publicUrl);
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-line bg-surface-2">
        {url && kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="size-full object-cover" />
        ) : url ? (
          <FileText className="size-8 text-accent" />
        ) : (
          <ImagePlus className="size-7 text-muted" />
        )}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <input
          id={id}
          name={name}
          value={url}
          onChange={(e) => setUrl(kind === "image" ? toDirectImageUrl(e.target.value.trim()) : e.target.value)}
          placeholder="Paste a URL or upload a file"
          className="input"
        />
        <div className="flex flex-wrap items-center gap-2">
          <label className="btn-ghost cursor-pointer px-3! py-1.5! text-xs!">
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
            {uploading ? "Uploading..." : "Upload"}
            <input
              type="file"
              accept={kind === "image" ? "image/*" : ".pdf,application/pdf"}
              onChange={onFile}
              disabled={uploading}
              className="sr-only"
            />
          </label>
          {url && (
            <button type="button" onClick={() => setUrl("")} className="inline-flex items-center gap-1 text-xs text-muted hover:text-red-500">
              <Trash2 className="size-3.5" /> Remove
            </button>
          )}
        </div>
        {url.includes("drive.google.com") && url.includes("/folders/") && (
          <p className="text-xs text-red-500">
            This is a Drive folder link. Open the folder, right-click the file → Share → Copy link, and paste that instead.
          </p>
        )}
        {kind === "image" && url.includes("googleusercontent.com") && (
          <p className="text-xs text-muted">
            Google Drive link converted. If the preview stays blank, set the file&apos;s sharing to &ldquo;Anyone with the link&rdquo;.
          </p>
        )}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
