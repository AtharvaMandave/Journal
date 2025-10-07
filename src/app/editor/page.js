"use client";

import useSWR from "swr";
import { useState } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function EditorDashboard() {
  const { data: papers, error, mutate } = useSWR("/api/editor/submitted", fetcher);
  const [modalPaper, setModalPaper] = useState(null);

  if (error) return <div className="p-8 text-red-600">Failed to load papers.</div>;

  return (
    <main className="p-8 sm:p-20 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Editor Dashboard</h1>

      {/* List of papers */}
      <div className="grid gap-4">
        {Array.isArray(papers) && papers.length > 0 ? (
          papers.map((p) => (
            <div key={p.id} className="bg-white shadow rounded-lg p-5 flex justify-between items-center border border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{p.title}</h2>
                <p className="text-sm text-gray-500">Status: {p.status}</p>
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
          <p className="text-gray-500">No submitted papers found.</p>
        )}
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
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Assign Reviewers for <span className="text-green-700">{paper.title}</span>
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
              <label key={r.id} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(r.id)}
                  onChange={(e) =>
                    setSelected((prev) =>
                      e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id)
                    )
                  }
                />
                <div>
                  <p className="font-medium text-gray-800">{r.name}</p>
                  <p className="text-sm text-gray-500">{r.email}</p>
                </div>
              </label>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No reviewers found.</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
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
