import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="font-mono text-sm text-accent">KeyError: 404</p>
        <h1 className="mt-3 font-display text-5xl font-bold">Page not found</h1>
        <p className="mt-4 text-muted">This row isn&apos;t in the dataset.</p>
        <Link href="/" className="btn-primary mt-8">
          Back home
        </Link>
      </div>
    </main>
  );
}
