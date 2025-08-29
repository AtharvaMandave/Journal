"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";

export default function IssuesAdminPage() {
  const { data: issues, mutate } = useSWR("/api/issues", (u) => fetch(u).then((r) => r.json()));
  const { data: accepted } = useSWR("/api/editor/accepted", (u) => fetch(u).then((r) => r.json()));
  const [form, setForm] = useState({ volume: "", issueNumber: "", year: new Date().getFullYear().toString(), coverImageUrl: "" });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedPaperIds, setSelectedPaperIds] = useState([]);

  async function createIssue(e) {
    e.preventDefault();
    await fetch("/api/issues", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ volume: Number(form.volume), issueNumber: Number(form.issueNumber), year: Number(form.year), coverImageUrl: form.coverImageUrl }) });
    setForm({ volume: "", issueNumber: "", year: new Date().getFullYear().toString(), coverImageUrl: "" });
    mutate();
  }

  async function updateIssuePapers() {
    if (!selectedIssue) return;
    await fetch(`/api/issues/${selectedIssue.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ papers: selectedPaperIds }) });
    mutate();
  }

  async function publishIssue(issueId) {
    await fetch("/api/issues/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ issueId }) });
    mutate();
  }

  return (
    <main className="p-8 sm:p-20">
      <h1 className="text-2xl font-semibold">Issue Management</h1>

      <section className="mt-8">
        <h2 className="text-xl font-medium">Create Issue</h2>
        <form onSubmit={createIssue} className="mt-4 grid gap-3 sm:grid-cols-4">
          <input className="rounded border px-3 py-2" placeholder="Volume" value={form.volume} onChange={(e) => setForm({ ...form, volume: e.target.value })} required />
          <input className="rounded border px-3 py-2" placeholder="Issue Number" value={form.issueNumber} onChange={(e) => setForm({ ...form, issueNumber: e.target.value })} required />
          <input className="rounded border px-3 py-2" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
          <input className="rounded border px-3 py-2 sm:col-span-2" placeholder="Cover Image URL" value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
          <button className="rounded bg-black px-4 py-2 text-white sm:col-span-2">Create</button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-medium">Issues</h2>
        <div className="mt-4 grid gap-3">
          {Array.isArray(issues) && issues.length > 0 ? issues.map((i) => (
            <div key={i.id} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Vol. {i.volume}, Issue {i.issueNumber} ({i.year})</p>
                  <p className="text-sm text-gray-600">{i.publishedAt ? `Published: ${new Date(i.publishedAt).toLocaleDateString()}` : "Unpublished"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedIssue(i)} className="rounded border px-3 py-1.5">Add Papers</button>
                  {!i.publishedAt ? (
                    <button onClick={() => publishIssue(i.id)} className="rounded bg-black px-3 py-1.5 text-white">Publish</button>
                  ) : null}
                </div>
              </div>
            </div>
          )) : <p className="text-sm text-gray-600">No issues yet.</p>}
        </div>
      </section>

      {selectedIssue ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl rounded bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Add Papers to Vol. {selectedIssue.volume} Issue {selectedIssue.issueNumber}</h3>
              <button onClick={() => setSelectedIssue(null)} className="rounded border px-3 py-1.5">Close</button>
            </div>
            <div className="mt-4 max-h-80 overflow-auto">
              {Array.isArray(accepted) && accepted.length > 0 ? accepted.map((p) => (
                <label key={p.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selectedPaperIds.includes(p.id)} onChange={(e) => setSelectedPaperIds((prev) => e.target.checked ? [...prev, p.id] : prev.filter((x) => x !== p.id))} />
                  {p.title}
                </label>
              )) : <p className="text-sm text-gray-600">No accepted papers</p>}
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={updateIssuePapers} className="rounded bg-black px-4 py-2 text-white">Save</button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}


