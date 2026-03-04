import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <p className="text-7xl font-extrabold text-indigo-600">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" /> Go Home
        </Link>
      </div>
    </div>
  );
}
