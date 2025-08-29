"use client";

import useSWR from "swr";
import Link from "next/link";

export default function ReviewerDashboard() {
  const { data } = useSWR("/api/reviewer/assigned", (u) => fetch(u).then((r) => r.json()));
  return (
    <main className="p-8 sm:p-20">
      <h1 className="text-2xl font-semibold">Reviewer Dashboard</h1>
      <div className="mt-6 grid gap-3">
        {Array.isArray(data) && data.length > 0 ? data.map((p) => (
          <div key={p.id} className="rounded border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-gray-600">Status: {p.status}</p>
              </div>
              <div className="flex items-center gap-3">
                {p.fileUrl ? <a href={p.fileUrl} className="text-sm underline" target="_blank" rel="noreferrer">PDF</a> : null}
                <Link href={`/review/${p.id}`} className="rounded border px-3 py-1.5">Review</Link>
              </div>
            </div>
          </div>
        )) : <p className="text-sm text-gray-600">No assignments</p>}
      </div>
    </main>
  );
}


