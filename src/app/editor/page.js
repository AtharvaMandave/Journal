"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function EditorDashboard() {
  const { data: papers, error, mutate } = useSWR("/api/editor/submitted", fetcher);
  const [modalPaper, setModalPaper] = useState(null);
  const [screenModal, setScreenModal] = useState(null);
  const [reviewsModal, setReviewsModal] = useState(null);
  const [uploadModalPaper, setUploadModalPaper] = useState(null);
  const [deciding, setDeciding] = useState(null);

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="mx-auto max-w-7xl rounded-xl bg-red-50 p-6 ring-1 ring-red-200">
        <p className="text-red-600 font-medium">Failed to load papers. Please try again.</p>
      </div>
    </div>
  );

  const statusColors = {
    submitted: "bg-blue-100 text-blue-700 ring-blue-200",
    "under-review": "bg-purple-100 text-purple-700 ring-purple-200",
    "pending-approval": "bg-amber-100 text-amber-700 ring-amber-200",
    "editor-rejected": "bg-orange-100 text-orange-700 ring-orange-200",
    accepted: "bg-green-100 text-green-700 ring-green-200",
    rejected: "bg-red-100 text-red-700 ring-red-200",
    revise: "bg-amber-100 text-amber-700 ring-amber-200",
    "final-version-uploaded": "bg-teal-100 text-teal-700 ring-teal-200",
  };

  async function makeDecision(paperId, decision) {
    setDeciding(paperId);
    try {
      const res = await fetch("/api/editor/accepted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId, decision })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to make decision");
        setDeciding(null);
        return;
      }

      // Show appropriate message based on role
      if (data.requiresAdminApproval) {
        alert("Your recommendation has been sent to admin for final approval.");
      }

      mutate();
    } catch (err) {
      alert("Failed to make decision: " + err.message);
    }
    setDeciding(null);
  }

  async function sendToAdmin(paperId) {
    try {
      const res = await fetch("/api/editor/send-to-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send to admin");
        return;
      }

      alert("Paper sent to admin for publication");
      mutate();
    } catch (err) {
      alert("Failed to send to admin: " + err.message);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Editor Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">Review and manage submitted papers</p>
        </div>

        {/* Papers Grid */}
        <div className="space-y-4">
          {Array.isArray(papers) && papers.length > 0 ? (
            papers.map((p) => (
              <div key={p.id} className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900 line-clamp-2">{p.title}</h2>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusColors[p.status] || statusColors.submitted}`}>
                        {p.status === "pending-approval" ? "Awaiting Admin" : p.status === "editor-rejected" ? "Editor Rejected" : p.status === "final-version-uploaded" ? "Final Version Uploaded" : p.status}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${p.screened ? "bg-green-100 text-green-700 ring-green-200" : "bg-slate-100 text-slate-600 ring-slate-200"}`}>
                        {p.screened ? "✓ Screened" : "Not Screened"}
                      </span>
                      {p.doi && (
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                          DOI: {p.doi}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.fileUrl && (
                      <a
                        href={p.editorVersionUrl || p.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open
                      </a>
                    )}
                  </div>

                </div>

                {/* Reviewer Invites */}
                {Array.isArray(p.reviewerInvites) && p.reviewerInvites.length > 0 && (
                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Reviewer Invites</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {p.reviewerInvites.map((ri, i) => {
                        const statusColor = ri.status === "accepted" ? "text-green-700" : ri.status === "declined" ? "text-red-700" : "text-slate-700";
                        return (
                          <div key={i} className="flex items-center justify-between rounded-md bg-white px-3 py-2 text-xs ring-1 ring-slate-200">
                            <span className="font-medium text-slate-900">ID: {ri.reviewerId.slice(-6)}</span>
                            <span className={`font-medium ${statusColor}`}>{ri.status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => setScreenModal(p)}
                    className="rounded-lg bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-200 transition-all hover:bg-slate-100"
                  >
                    Screen Paper
                  </button>
                  <button
                    onClick={() => makeDecision(p.id, "accepted")}
                    disabled={deciding === p.id || p.status === "pending-approval"}
                    className="rounded-lg bg-green-50 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-green-200 transition-all hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deciding === p.id ? "Processing..." : p.status === "pending-approval" ? "✓ Recommended" : "✓ Recommend Accept"}
                  </button>
                  <button
                    onClick={() => makeDecision(p.id, "revise")}
                    disabled={deciding === p.id}
                    className="rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 ring-1 ring-amber-200 transition-all hover:bg-amber-100 disabled:opacity-50"
                  >
                    {deciding === p.id ? "Processing..." : "↻ Request Revision"}
                  </button>
                  <button
                    onClick={() => makeDecision(p.id, "rejected")}
                    disabled={deciding === p.id || p.status === "editor-rejected"}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 ring-1 ring-red-200 transition-all hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deciding === p.id ? "Processing..." : p.status === "editor-rejected" ? "✕ Recommended Reject" : "✕ Recommend Reject"}
                  </button>
                  <button
                    onClick={() => setUploadModalPaper(p)}
                    className="rounded-lg bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700 ring-1 ring-sky-200 transition-all hover:bg-sky-100"
                  >
                    Upload New Version
                  </button>
                  <button
                    onClick={() => sendToAdmin(p.id)}
                    disabled={p.status !== "final-version-uploaded"}
                    className="rounded-lg bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700 ring-1 ring-teal-200 transition-all hover:bg-teal-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send to Admin for Publication
                  </button>
                  <button
                    onClick={() => setReviewsModal(p.id)}
                    className="rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-200 transition-all hover:bg-indigo-100"
                  >
                    View Reviews
                  </button>
                </div>

                {/* Warning message for pending papers */}
                {(p.status === "pending-approval" || p.status === "editor-rejected") && (
                  <div className="mt-3 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
                    <p className="text-xs text-amber-800">
                      ⚠️ This paper is awaiting admin review for final decision
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-900/5">
              <p className="text-slate-600">No submitted papers found.</p>
            </div>
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

        {reviewsModal && (
          <ReviewsViewer
            paperId={reviewsModal}
            onClose={() => setReviewsModal(null)}
          />
        )}

        {uploadModalPaper && (
          <UploadModal
            paper={uploadModalPaper}
            onClose={() => setUploadModalPaper(null)}
            onUploaded={() => {
              mutate();
              setUploadModalPaper(null);
            }}
          />
        )}
      </div>
    </main>
  );
}

// AssignModal, ScreenModal, and ReviewsViewer components remain the same as in your original code
function AssignModal({ paper, onClose, onAssigned }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  async function searchReviewers() {
    if (!query.trim()) {
      setLoading(true);
      const res = await fetch(`/api/admin/search-reviewers`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/admin/search-reviewers?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function assignReviewers() {
    if (selected.length === 0) {
      alert("Please select at least one reviewer.");
      return;
    }
    setAssigning(true);
    try {
      const response = await fetch("/api/admin/assign-reviewers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: paper.id, reviewerIds: selected }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign reviewers");
      }

      onAssigned();
    } catch (err) {
      alert("Failed to assign reviewers: " + err.message);
      setAssigning(false);
    }
  }

  useEffect(() => {
    searchReviewers();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Assign Reviewers</h3>
            <p className="mt-1 text-sm text-slate-600 line-clamp-1">{paper.title}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchReviewers()}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button
            onClick={searchReviewers}
            disabled={loading}
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search Reviewers"}
          </button>
        </div>

        <div className="mt-6 max-h-96 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
          {results.length > 0 ? (
            results.map((r) => (
              <label
                key={r.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-3 ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:ring-slate-300"
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
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900">{r.name}</p>
                  <p className="text-sm text-slate-600">{r.email}</p>
                  {r.affiliation && (
                    <p className="text-xs text-slate-500">{r.affiliation}</p>
                  )}
                </div>
                {selected.includes(r.id) && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    Selected
                  </span>
                )}
              </label>
            ))
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">
                {loading ? "Loading reviewers..." : "No reviewers found"}
              </p>
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div className="mt-4 rounded-lg bg-blue-50 p-3 ring-1 ring-blue-200">
            <p className="text-sm font-medium text-blue-900">
              {selected.length} reviewer{selected.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={assignReviewers}
            disabled={assigning || selected.length === 0}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {assigning ? "Assigning..." : `Assign ${selected.length > 0 ? `(${selected.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScreenModal({ paper, onClose, onSaved }) {
  const [checked, setChecked] = useState(paper.screened || true);
  const [notes, setNotes] = useState(paper.screeningNotes || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/screen", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paperId: paper.id, screened: checked, notes }),
      });
      onSaved();
    } catch (err) {
      alert("Failed to save screening");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Screen Paper</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="text-sm font-medium text-slate-700">Mark as screened</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Screening Notes
            </label>
            <textarea
              className="w-full rounded-lg border border-slate-300 p-3 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              rows={5}
              placeholder="Add any notes about this paper..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
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
      try {
        const res = await fetch(`/api/reviews?paperId=${encodeURIComponent(paperId)}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
      setLoading(false);
    }
    load();
  }, [paperId]);

  const recommendationColors = {
    accept: "bg-green-100 text-green-700 ring-green-200",
    "minor-revision": "bg-blue-100 text-blue-700 ring-blue-200",
    "major-revision": "bg-amber-100 text-amber-700 ring-amber-200",
    reject: "bg-red-100 text-red-700 ring-red-200"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Reviews</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
              <p className="ml-3 text-sm text-slate-500">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">No reviews submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, idx) => (
                <div key={r.id} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        R{idx + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Reviewer ID: {r.reviewerId?.slice(-8)}
                        </p>
                        {r.rating && (
                          <p className="text-sm text-slate-600">
                            Rating: <span className="font-medium">{r.rating}/10</span>
                          </p>
                        )}
                      </div>
                    </div>
                    {r.recommendation && (
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${recommendationColors[r.recommendation] || "bg-slate-100 text-slate-700 ring-slate-200"}`}>
                        {r.recommendation.replace('-', ' ')}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 rounded-lg bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Comments
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                      {r.comments || "(No comments provided)"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UploadModal({ paper, onClose, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("paperId", paper.id);
    formData.append("file", file);

    try {
      const res = await fetch("/api/editor/upload-version", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to upload file");
        setUploading(false);
        return;
      }

      alert("File uploaded successfully");
      onUploaded();
    } catch (err) {
      alert("Failed to upload file: " + err.message);
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Upload New Version</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Paper File
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}