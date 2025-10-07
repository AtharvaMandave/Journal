"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function EditorDashboard() {
  const { data: papers, error, mutate } = useSWR("/api/editor/submitted", fetcher);
  const [modalPaper, setModalPaper] = useState(null);
  const [screenModal, setScreenModal] = useState(null);
  const [deciding, setDeciding] = useState(null);

  if (error) return <div className="p-8 text-red-600">Failed to load papers.</div>;

  return (
    <main className="p-8 sm:p-20 bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">Editor Dashboard</h1>

      {/* List of papers */}
      <div className="grid gap-4">
        {Array.isArray(papers) && papers.length > 0 ? (
          papers.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow rounded-lg p-5 flex justify-between items-center border border-gray-300"
            >
              <div>
                <h2 className="text-lg font-semibold text-black">{p.title}</h2>
                <p className="text-sm text-gray-700">Status: {p.status}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Screened: {p.screened ? "Yes" : "No"}
                </p>
                <div className="mt-1 flex gap-3 items-center text-xs">
                  {p.fileUrl ? (
                    <a
                      href={p.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-700 underline"
                    >
                      PDF
                    </a>
                  ) : null}
                  {p.doi ? <span className="text-gray-800">DOI: {p.doi}</span> : null}
                </div>
                {Array.isArray(p.reviewerInvites) && p.reviewerInvites.length > 0 ? (
                  <div className="mt-2">
                    <p className="text-xs text-gray-700">Invites:</p>
                    <ul className="text-xs text-gray-800 list-disc ml-5">
                      {p.reviewerInvites.map((ri, i) => (
                        <li key={i}>
                          {ri.reviewerId.slice(-4)} — {ri.status}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              <button
                onClick={() => setModalPaper(p)}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
              >
                Assign Reviewers
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-700">No submitted papers found.</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6 grid gap-3">
        {Array.isArray(papers)
          ? papers.map((p) => (
              <div key={p.id} className="flex gap-2">
                <button
                  onClick={() => setScreenModal(p)}
                  className="px-3 py-1.5 text-sm border rounded text-black hover:bg-gray-100"
                >
                  Screen
                </button>
                <button
                  onClick={async () => {
                    setDeciding(p.id);
                    await fetch("/api/admin/decide", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ paperId: p.id, decision: "accepted" }),
                    });
                    setDeciding(null);
                    mutate();
                  }}
                  className="px-3 py-1.5 text-sm border rounded text-black hover:bg-gray-100"
                >
                  Accept
                </button>
                <button
                  onClick={async () => {
                    setDeciding(p.id);
                    await fetch("/api/admin/decide", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ paperId: p.id, decision: "revise" }),
                    });
                    setDeciding(null);
                    mutate();
                  }}
                  className="px-3 py-1.5 text-sm border rounded text-black hover:bg-gray-100"
                >
                  Revise
                </button>
                <button
                  onClick={async () => {
                    setDeciding(p.id);
                    await fetch("/api/admin/decide", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ paperId: p.id, decision: "rejected" }),
                    });
                    setDeciding(null);
                    mutate();
                  }}
                  className="px-3 py-1.5 text-sm border rounded text-black hover:bg-gray-100"
                >
                  Reject
                </button>
              </div>
            ))
          : null}
      </div>

      {modalPaper && (
        <AssignModal
          paper={modalPaper}
          onClose={() => setModalPaper(null)}
          onAssigned={() => {
            mutate();
            setModalPaper(null);
          }}
        />
      )}

      {screenModal && (
        <ScreenModal
          paper={screenModal}
          onClose={() => setScreenModal(null)}
          onSaved={() => {
            mutate();
            setScreenModal(null);
          }}
        />
      )}
    </main>
  );
}

function AssignModal({ paper, onClose, onAssigned }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  async function searchReviewers() {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/admin/search-reviewers?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function assignReviewers() {
    if (selected.length === 0) {
      alert("Select at least one reviewer.");
      return;
    }
    setAssigning(true);
    await fetch("/api/admin/assign-reviewers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paperId: paper.id, reviewerIds: selected }),
    });
    setAssigning(false);
    onAssigned();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative text-black">
        <h3 className="text-xl font-semibold mb-4">
          Assign Reviewers for{" "}
          <span className="text-green-700">{paper.title}</span>
        </h3>

        {/* Search input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search reviewer by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          />
          <button
            onClick={searchReviewers}
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
          {results.length > 0 ? (
            results.map((r) => (
              <label
                key={r.id}
                className="flex items-center gap-2 p-2 border rounded hover:bg-gray-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(r.id)}
                  onChange={(e) =>
                    setSelected((prev) =>
                      e.target.checked
                        ? [...prev, r.id]
                        : prev.filter((x) => x !== r.id)
                    )
                  }
                />
                <div>
                  <p className="font-medium text-black">{r.name}</p>
                  <p className="text-sm text-gray-700">{r.email}</p>
                </div>
              </label>
            ))
          ) : (
            <p className="text-gray-700 text-sm">No reviewers found.</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={assignReviewers}
            disabled={assigning}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-60"
          >
            {assigning ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenModal({ paper, onClose, onSaved }) {
  const [checked, setChecked] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/screen", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paperId: paper.id, screened: checked, notes }),
    });
    setSaving(false);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md text-black">
        <h3 className="text-lg font-semibold mb-3">Screen Paper</h3>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />{" "}
          Mark as screened
        </label>
        <textarea
          className="w-full border rounded mt-3 p-2 text-sm"
          rows={4}
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewsViewer({ paperId, onClose }) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/reviews?paperId=${encodeURIComponent(paperId)}`);
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    load();
  }, [paperId]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl text-black">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <button onClick={onClose} className="px-3 py-1.5 border rounded">
            Close
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-700">Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-700">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="border rounded p-3">
                <p className="text-sm">
                  <span className="font-medium">Reviewer:</span>{" "}
                  {r.reviewerId?.slice(-4)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Rating:</span> {r.rating}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Recommendation:</span>{" "}
                  {r.recommendation}
                </p>
                <div className="text-sm mt-2">
                  <p className="font-medium">Comments:</p>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {r.comments || "(no comments)"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
