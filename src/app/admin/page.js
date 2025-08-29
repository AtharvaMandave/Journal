"use client";

import useSWR from "swr";
import { useState } from "react";

export default function AdminConsole() {
  return (
    <main className="p-8 sm:p-20 bg-black">
      <h1 className="text-2xl font-semibold">Admin Console</h1>
      <MetricsPanel />
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <UsersPanel />
        <PapersPanel />
      </div>
    </main>
  );
}

function MetricsPanel() {
  const { data } = useSWR("/api/admin/metrics", (u) => fetch(u).then((r) => r.json()));
  return (
    <section className="mt-6">
      <h2 className="text-xl font-medium">Metrics (last 30 days)</h2>
      {data ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <Stat label="Submissions" value={data.submissionsLast30} />
          <Stat label="Accepted" value={data.acceptedLast30} />
          <Stat label="Acceptance rate" value={`${Math.round((data.acceptanceRate || 0) * 100)}%`} />
          <div className="rounded border p-3">
            <p className="text-sm font-medium">Top reviewers</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-700">
              {(data.topReviewerActivity || []).map((r, i) => (
                <li key={i}>Reviewer {r.reviewerId.slice(-4)}: {r.count}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-600">Loading...</p>
      )}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded border p-3">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function UsersPanel() {
  const { data, mutate } = useSWR("/api/admin/users", (u) => fetch(u).then((r) => r.json()));
  async function setRole(userId, role) {
    await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, role }) });
    mutate();
  }
  async function toggleActive(userId, active) {
    await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, active }) });
    mutate();
  }
  return (
    <section>
      <h2 className="text-xl font-medium">Users</h2>
      <div className="mt-4 grid gap-2">
        {Array.isArray(data) && data.length > 0 ? data.map((u) => (
          <div key={u.id} className="rounded border p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{u.name} <span className="text-gray-600">({u.email})</span></p>
                <p className="text-gray-600">{u.affiliation}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={u.role} onChange={(e) => setRole(u.id, e.target.value)} className="rounded border px-2 py-1">
                  <option value="author">Author</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={u.active} onChange={(e) => toggleActive(u.id, e.target.checked)} /> Active
                </label>
              </div>
            </div>
          </div>
        )) : <p className="text-gray-600">No users found</p>}
      </div>
    </section>
  );
}

function PapersPanel() {
  const { data, mutate } = useSWR("/api/editor/submitted", (u) => fetch(u).then((r) => r.json()));
  const { data: search, mutate: mutSearch } = useSWR(null, (u) => fetch(u).then((r) => r.json()));
  const [q, setQ] = useState("");
  async function doSearch(e) {
    e.preventDefault();
    mutSearch("/api/admin/search-papers?q=" + encodeURIComponent(q));
  }
  async function decide(paperId, decision) {
    await fetch("/api/admin/decide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paperId, decision }) });
    mutate();
  }
  return (
    <section>
      <h2 className="text-xl font-medium">Papers</h2>
      <form onSubmit={doSearch} className="mt-3 flex gap-2">
        <input className="w-full rounded border px-3 py-2" placeholder="Search by title/abstract/keyword" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="rounded border px-3 py-2">Search</button>
      </form>
      <div className="mt-4 grid gap-2">
        {Array.isArray(data) && data.length > 0 ? data.map((p) => (
          <div key={p.id} className="rounded border p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-gray-600">Status: {p.status}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decide(p.id, "accepted")} className="rounded border px-2 py-1">Accept</button>
                <button onClick={() => decide(p.id, "revise")} className="rounded border px-2 py-1">Revise</button>
                <button onClick={() => decide(p.id, "rejected")} className="rounded border px-2 py-1">Reject</button>
              </div>
            </div>
          </div>
        )) : <p className="text-gray-600">No papers</p>}
        {Array.isArray(search) && search.length > 0 ? (
          <div className="mt-6">
            <p className="text-sm font-medium">Search results</p>
            <div className="mt-2 grid gap-2">
              {search.map((p) => (
                <div key={p.id} className="rounded border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{p.title}</p>
                      <p className="text-gray-600">Status: {p.status}</p>
                    </div>
                    {p.fileUrl ? <a href={p.fileUrl} className="text-sm underline" target="_blank" rel="noreferrer">PDF</a> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}


