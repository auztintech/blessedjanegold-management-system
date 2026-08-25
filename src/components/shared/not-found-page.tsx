"use client";

import Link from "next/link";
import { ArrowLeft, LayoutDashboard, SearchX } from "lucide-react";

interface NotFoundPageProps {
  dashboardPath: string;
}

export default function NotFoundPage({ dashboardPath }: NotFoundPageProps) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <SearchX className="h-10 w-10 text-primary" />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-primary">
          404 Error
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved, removed, or the address may be incorrect.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={dashboardPath}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors sm:w-auto">
            <LayoutDashboard className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400">
            If you believe this page should exist, please contact your
            administrator.
          </p>
        </div>
      </div>
    </main>
  );
}
