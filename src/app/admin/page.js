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
  const { data: users } = useSWR("/api/admin/users", (u) => fetch(u).then((r) => r.json()));
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null); // { type: 'screen'|'editor'|'reviewers'|'doi', paper }
  const [screened, setScreened] = useState(false);
  const [screeningNotes, setScreeningNotes] = useState("");
  const [editorId, setEditorId] = useState("");
  const [doi, setDoi] = useState("");
  const [revQuery, setRevQuery] = useState("");
  const { data: reviewerResults, mutate: mutReviewers } = useSWR(null, (u) => fetch(u).then((r) => r.json()));
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([]);

  async function doSearch(e) {
    e.preventDefault();
    mutSearch("/api/admin/search-papers?q=" + encodeURIComponent(q));
  }
  async function decide(paperId, decision) {
    await fetch("/api/admin/decide", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paperId, decision }) });
    mutate();
  }
  function openScreenModal(paper) {
    setModal({ type: "screen", paper });
    setScreened(true);
    setScreeningNotes("");
  }
  async function submitScreen() {
    if (!modal?.paper) return;
    await fetch("/api/admin/screen", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paperId: modal.paper.id, screened, notes: screeningNotes }) });
    setModal(null);
    mutate();
  }
  function openEditorModal(paper) {
    setModal({ type: "editor", paper });
    setEditorId("");
  }
  async function submitEditor() {
    if (!modal?.paper || !editorId) return;
    await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paperId: modal.paper.id, editorId }) });
    setModal(null);
    mutate();
  }
  function openReviewersModal(paper) {
    setModal({ type: "reviewers", paper });
    setSelectedReviewerIds([]);
    setRevQuery("");
    mutReviewers(null);
  }
  function openDoiModal(paper) {
    setModal({ type: "doi", paper });
    setDoi(paper.doi || "");
  }
  async function searchReviewers(e) {
    e.preventDefault();
    const url = "/api/admin/search-reviewers" + (revQuery ? "?q=" + encodeURIComponent(revQuery) : "");
    mutReviewers(url);
  }
  async function assignReviewers() {
    if (!modal?.paper || selectedReviewerIds.length === 0) return;
    await fetch("/api/admin/assign-reviewers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paperId: modal.paper.id, reviewerIds: selectedReviewerIds }) });
    setModal(null);
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
                <button onClick={() => openScreenModal(p)} className="rounded border px-2 py-1">Screen</button>
                <button onClick={() => openEditorModal(p)} className="rounded border px-2 py-1">Assign Editor</button>
                <button onClick={() => openReviewersModal(p)} className="rounded border px-2 py-1">Assign Reviewers</button>
                <button onClick={() => openDoiModal(p)} className="rounded border px-2 py-1">Set DOI</button>
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

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded bg-white p-4 text-gray-900">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                {modal.type === "screen" ? "Admin Screening" : modal.type === "editor" ? "Assign Editor" : "Assign Reviewers"}
              </h3>
              <button onClick={() => setModal(null)} className="rounded border px-3 py-1.5">Close</button>
            </div>

            {modal.type === "screen" ? (
              <div className="mt-4 space-y-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={screened} onChange={(e) => setScreened(e.target.checked)} /> Mark as screened
                </label>
                <textarea className="w-full rounded border p-2 text-sm" rows={4} placeholder="Screening notes (optional)" value={screeningNotes} onChange={(e) => setScreeningNotes(e.target.value)} />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="rounded border px-4 py-2">Cancel</button>
                  <button onClick={submitScreen} className="rounded bg-black px-4 py-2 text-white">Save</button>
                </div>
              </div>
            ) : null}

            {modal.type === "editor" ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm">Select an editor to assign to this paper.</p>
                <select className="w-full rounded border p-2 text-sm" value={editorId} onChange={(e) => setEditorId(e.target.value)}>
                  <option value="">Select editor</option>
                  {Array.isArray(users) ? users.filter((u) => u.role === "editor").map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  )) : null}
                </select>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="rounded border px-4 py-2">Cancel</button>
                  <button disabled={!editorId} onClick={submitEditor} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">Assign</button>
                </div>
              </div>
            ) : null}

                {modal.type === "reviewers" ? (
              <div className="mt-4 space-y-4">
                <form onSubmit={searchReviewers} className="flex gap-2">
                  <input className="w-full rounded border px-3 py-2 text-sm" placeholder="Search reviewers by name or email" value={revQuery} onChange={(e) => setRevQuery(e.target.value)} />
                  <button className="rounded border px-3 py-2 text-sm">Search</button>
                </form>
                <div className="max-h-64 overflow-auto rounded border">
                  <ul className="divide-y">
                    {Array.isArray(reviewerResults) && reviewerResults.length > 0 ? reviewerResults.map((r) => {
                      const checked = selectedReviewerIds.includes(r.id);
                      return (
                        <li key={r.id} className="flex items-center justify-between p-2 text-sm">
                          <div>
                            <p className="font-medium">{r.name}</p>
                            <p className="text-gray-600">{r.email}</p>
                          </div>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={checked} onChange={(e) => {
                              setSelectedReviewerIds((prev) => e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id));
                            }} />
                            Select
                          </label>
                        </li>
                      );
                    }) : (
                      <li className="p-2 text-sm text-gray-600">No reviewers found</li>
                    )}
                  </ul>
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="rounded border px-4 py-2">Cancel</button>
                  <button disabled={selectedReviewerIds.length === 0} onClick={assignReviewers} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">Assign</button>
                </div>
              </div>
            ) : null}

                {modal.type === "doi" ? (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm">Set DOI for this paper.</p>
                    <input className="w-full rounded border p-2 text-sm" placeholder="10.xxxx/xxxxx" value={doi} onChange={(e) => setDoi(e.target.value)} />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setModal(null)} className="rounded border px-4 py-2">Cancel</button>
                      <button onClick={async () => { await fetch('/api/admin/papers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paperId: modal.paper.id, doi }) }); setModal(null); mutate(); }} className="rounded bg-black px-4 py-2 text-white">Save</button>
                    </div>
                  </div>
                ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}


