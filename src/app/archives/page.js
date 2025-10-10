"use client";

import useSWR from "swr";
import { useState } from "react";

export default function ArchivesPage() {
  const [q, setQ] = useState("");
  const { data } = useSWR(`/api/arch?q=${encodeURIComponent(q)}`, (u) =>
    fetch(u).then((r) => r.json())
  );

  return (
    <main className="p-8 sm:p-20 bg-white text-black">
      <h1 className="text-2xl font-semibold text-black">Archives</h1>
      <div className="mt-4 flex gap-2">
        <input
          className="w-full rounded-2xl border px-3 py-2"
          placeholder="Search by title/abstract/keyword"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="mt-6 grid gap-3">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((p) => (
            <div key={p.id} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{p.title}</p>
                  <p className="text-sm text-black">
                    Published on: {new Date(p.publishedAt).toLocaleDateString()}
                  </p>
                </div>
                {p.fileUrl ? (
                  <a
                    href={p.fileUrl}
                    className="text-sm underline text-blue-700"
                    target="_blank"
                    rel="noreferrer"
                  >
                    PDF
                  </a>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-black">No papers found.</p>
        )}
      </div>
    </main>
  );
}
