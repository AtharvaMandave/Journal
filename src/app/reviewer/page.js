"use client";

import useSWR from "swr";
import Link from "next/link";

export default function ReviewerDashboard() {
  const { data } = useSWR("/api/reviewer/assigned", (u) => fetch(u).then((r) => r.json()));
  return (
    <main className="min-h-screen bg-gray-50 p-8 sm:p-20">
      <h1 className="text-2xl font-semibold text-gray-900">Reviewer Dashboard</h1>
      <div className="mt-6 grid gap-3">
        {Array.isArray(data) && data.length > 0 ? data.map((p) => (
          <div key={p.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{p.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-700">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1">Status: {p.status}</span>
                  {p.inviteStatus ? <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Invite: {p.inviteStatus}</span> : null}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {p.fileUrl ? <a href={p.fileUrl} className="text-sm underline" target="_blank" rel="noreferrer">PDF</a> : null}
                {p.inviteStatus === "invited" ? (
                  <>
                    <button onClick={async () => { await fetch('/api/reviewer/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paperId: p.id, response: 'accept' }) }); location.reload(); }} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm text-white hover:bg-emerald-700">Accept</button>
                    <button onClick={async () => { await fetch('/api/reviewer/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paperId: p.id, response: 'decline' }) }); location.reload(); }} className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm text-white hover:bg-rose-700">Decline</button>
                  </>
                ) : null}
                <Link href={`/review/${p.id}`} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">Review</Link>
              </div>
            </div>
          </div>
        )) : <p className="text-sm text-gray-600">No assignments</p>}
      </div>
    </main>
  );
}


