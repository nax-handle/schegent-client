// app/not-found.tsx
"use client";

import { useEffect } from "react";
import { useNotFound } from "@/context/not-found-context";
import Link from "next/link";

export default function NotFoundPage() {
  const { setIsNotFound } = useNotFound();

  useEffect(() => {
    setIsNotFound(true);
    return () => setIsNotFound(false);
  }, [setIsNotFound]);

  return (
    <main className="grid min-h-full h-screen items-center bg-white px-6 py-24">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-5xl font-semibold text-gray-900">
          Page not found
        </h1>
        <p className="mt-6 text-lg text-gray-500">
          Sorry, we could not find the page you are looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}
