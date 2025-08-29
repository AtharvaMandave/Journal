"use client";

import useSWR from "swr";
import { useState } from "react";

export default function EditorDashboard() {
  const { data: papers, mutate } = useSWR("/api/editor/submitted", (u) => fetch(u).then((r) => r.json()));
  const [modalPaper, setModalPaper] = useState(null);

  return (
    <main className="p-8 sm:p-20">
      <h1 className="text-2xl font-semibold">Editor Dashboard</h1>
      <div className="mt-6 grid gap-3">
        {Array.isArray(papers) && papers.length > 0 ? papers.map((p) => (
          <div key={p.id} className="rounded border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-gray-600">Status: {p.status}</p>
              </div>
              <button className="rounded border px-3 py-1.5" onClick={() => setModalPaper(p)}>Assign Reviewers</button>
            </div>
          </div>
        )) : <p className="text-sm text-gray-600">No submitted papers</p>}
      </div>

      {modalPaper ? <AssignModal paper={modalPaper} onClose={() => setModalPaper(null)} onAssigned={() => { setModalPaper(null); mutate(); }} /> : null}
    </main>
  );
}

function AssignModal({ paper, onClose, onAssigned }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  async function search() {
    const r = await fetch(`/api/admin/search-reviewers?q=${encodeURIComponent(q)}`);
    const j = await r.json();
    setResults(Array.isArray(j) ? j : []);
  }
  async function assign() {
    await fetch("/api/admin/assign-reviewers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paperId: paper.id, reviewerIds: selected }) });
    onAssigned();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded bg-white p-4">
        <h3 className="text-lg font-medium">Assign Reviewers</h3>
        <div className="mt-3 flex gap-2">
          <input className="w-full rounded border px-3 py-2" placeholder="Search by name or email" value={q} onChange={(e) => setQ(e.target.value)} />
          <button onClick={search} className="rounded border px-3 py-2">Search</button>
        </div>
        <div className="mt-3 max-h-60 space-y-2 overflow-auto">
          {results.map((r) => (
            <label key={r.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selected.includes(r.id)} onChange={(e) => setSelected((prev) => e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id))} />
              {r.name} ({r.email})
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-3 py-2">Cancel</button>
          <button onClick={assign} className="rounded bg-black px-3 py-2 text-white">Assign</button>
        </div>
      </div>
    </div>
  );
}


