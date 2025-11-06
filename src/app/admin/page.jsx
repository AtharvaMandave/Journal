"use client";

import useSWR from "swr";
import { useState, useCallback } from "react";
import Link from "next/link";
import axios from "axios";

// Axios instance with default config
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// SWR fetcher using axios
const fetcher = (url) => api.get(url).then((res) => res.data);

export default function AdminConsole() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl p-6 sm:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
          <p className="mt-1 text-sm text-slate-600">Manage users, papers, and system metrics</p>
        </div>
        <MetricsPanel />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <UsersPanel />
          <PapersPanel />
        </div>
      </div>
    </main>
  );
}

function MetricsPanel() {
  const { data, error, isLoading } = useSWR("/admin/metrics", fetcher);

  if (error) {
    return (
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
        <p className="text-sm text-red-600">Failed to load metrics</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Metrics Overview</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Last 30 days</span>
      </div>
      {isLoading ? (
        <div className="mt-6 flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
          <p className="ml-3 text-sm text-slate-500">Loading metrics...</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Stat label="Submissions" value={data?.submissionsLast30 || 0} trend="+12%" />
          <Stat label="Accepted" value={data?.acceptedLast30 || 0} trend="+8%" />
          <Stat label="Acceptance Rate" value={`${Math.round((data?.acceptanceRate || 0) * 100)}%`} />
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 ring-1 ring-blue-100">
            <p className="text-sm font-semibold text-slate-900">Top Reviewers</p>
            <ul className="mt-3 space-y-2">
              {(data?.topReviewerActivity || []).slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">Reviewer {r.reviewerId?.slice(-4)}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-slate-600">{r.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, trend }) {
  return (
    <div className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {trend && <span className="text-xs font-medium text-green-600">{trend}</span>}
      </div>
    </div>
  );
}

function UsersPanel() {
  const { data, mutate, error, isLoading } = useSWR("/admin/users", fetcher);
  const [updating, setUpdating] = useState(null);

  const setRole = useCallback(async (userId, role) => {
    try {
      setUpdating(userId);
      await api.patch("/admin/users", { userId, role });
      await mutate();
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update user role");
    } finally {
      setUpdating(null);
    }
  }, [mutate]);

  const toggleActive = useCallback(async (userId, active) => {
    try {
      setUpdating(userId);
      await api.patch("/admin/users", { userId, active });
      await mutate();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update user status");
    } finally {
      setUpdating(null);
    }
  }, [mutate]);
  
  const roleColors = {
    admin: "bg-purple-100 text-purple-700 ring-purple-200",
    editor: "bg-blue-100 text-blue-700 ring-blue-200",
    reviewer: "bg-green-100 text-green-700 ring-green-200",
    author: "bg-slate-100 text-slate-700 ring-slate-200"
  };

  if (error) {
    return (
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
        <h2 className="text-lg font-semibold text-slate-900">User Management</h2>
        <p className="mt-4 text-sm text-red-600">Failed to load users</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">User Management</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {Array.isArray(data) ? data.length : 0} users
        </span>
      </div>
      <div className="mt-6 space-y-3 max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
            <p className="mt-3 text-sm text-slate-500">Loading users...</p>
          </div>
        ) : Array.isArray(data) && data.length > 0 ? data.map((u) => (
          <div key={u.id} className={`group rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm ${updating === u.id ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 truncate">{u.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${roleColors[u.role] || roleColors.author}`}>
                    {u.role}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600 truncate">{u.email}</p>
                <p className="mt-0.5 text-xs text-slate-500">{u.affiliation}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <select 
                  value={u.role} 
                  onChange={(e) => setRole(u.id, e.target.value)}
                  disabled={updating === u.id}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="author">Author</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={u.active} 
                    onChange={(e) => toggleActive(u.id, e.target.checked)}
                    disabled={updating === u.id}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="text-xs font-medium text-slate-700">Active</span>
                </label>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">No users found</p>
          </div>
        )}
      </div>
    </section>
  );
}

function PapersPanel() {
  const { data, mutate, error, isLoading } = useSWR("/editor/submitted", fetcher);
  const { data: users } = useSWR("/admin/users", fetcher);
  const [q, setQ] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [modal, setModal] = useState(null);
  const [screened, setScreened] = useState(false);
  const [screeningNotes, setScreeningNotes] = useState("");
  const [editorId, setEditorId] = useState("");
  const [doi, setDoi] = useState("");
  const [revQuery, setRevQuery] = useState("");
  const [reviewerResults, setReviewerResults] = useState(null);
  const [searchingReviewers, setSearchingReviewers] = useState(false);
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([]);
  const [viewPaper, setViewPaper] = useState(null);
  const [processing, setProcessing] = useState(false);

  const doSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    
    try {
      setSearching(true);
      const response = await api.get(`/admin/search-papers?q=${encodeURIComponent(q)}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Failed to search papers");
    } finally {
      setSearching(false);
    }
  }, [q]);

  const decide = useCallback(async (paperId, decision) => {
    if (!confirm(`Are you sure you want to mark this paper as ${decision}?`)) return;
    
    try {
      setProcessing(true);
      await api.post("/admin/decide", { paperId, decision });
      await mutate();
    } catch (err) {
      console.error("Failed to update decision:", err);
      alert("Failed to update paper status");
    } finally {
      setProcessing(false);
    }
  }, [mutate]);

  const openScreenModal = useCallback((paper) => {
    setModal({ type: "screen", paper });
    setScreened(paper.screened || false);
    setScreeningNotes(paper.screeningNotes || "");
  }, []);

  const submitScreen = useCallback(async () => {
    if (!modal?.paper) return;
    
    try {
      setProcessing(true);
      await api.patch("/admin/screen", { 
        paperId: modal.paper.id, 
        screened, 
        notes: screeningNotes 
      });
      setModal(null);
      await mutate();
    } catch (err) {
      console.error("Failed to update screening:", err);
      alert("Failed to update screening status");
    } finally {
      setProcessing(false);
    }
  }, [modal, screened, screeningNotes, mutate]);

  const openEditorModal = useCallback((paper) => {
    setModal({ type: "editor", paper });
    setEditorId(paper.editorId || "");
  }, []);

  const submitEditor = useCallback(async () => {
    if (!modal?.paper || !editorId) return;
    
    try {
      setProcessing(true);
      await api.post("/admin/users", { paperId: modal.paper.id, editorId });
      setModal(null);
      await mutate();
    } catch (err) {
      console.error("Failed to assign editor:", err);
      alert("Failed to assign editor");
    } finally {
      setProcessing(false);
    }
  }, [modal, editorId, mutate]);

  const openReviewersModal = useCallback((paper) => {
    setModal({ type: "reviewers", paper });
    setSelectedReviewerIds([]);
    setRevQuery("");
    setReviewerResults(null);
  }, []);

  const searchReviewers = useCallback(async (e) => {
    e.preventDefault();
    
    try {
      setSearchingReviewers(true);
      const url = revQuery ? `/admin/search-reviewers?q=${encodeURIComponent(revQuery)}` : "/admin/search-reviewers";
      const response = await api.get(url);
      setReviewerResults(response.data);
    } catch (err) {
      console.error("Failed to search reviewers:", err);
      alert("Failed to search reviewers");
    } finally {
      setSearchingReviewers(false);
    }
  }, [revQuery]);

  const assignReviewers = useCallback(async () => {
    if (!modal?.paper || selectedReviewerIds.length === 0) return;
    
    try {
      setProcessing(true);
      await api.post("/admin/assign-reviewers", {
        paperId: modal.paper.id,
        reviewerIds: selectedReviewerIds
      });
      setModal(null);
      await mutate();
    } catch (err) {
      console.error("Failed to assign reviewers:", err);
      alert("Failed to assign reviewers");
    } finally {
      setProcessing(false);
    }
  }, [modal, selectedReviewerIds, mutate]);

  const openDoiModal = useCallback((paper) => {
    setModal({ type: "doi", paper });
    setDoi(paper.doi || "");
  }, []);

  const submitDoi = useCallback(async () => {
    if (!modal?.paper) return;
    
    try {
      setProcessing(true);
      await api.patch("/admin/papers", { 
        paperId: modal.paper.id, 
        doi 
      });
      setModal(null);
      await mutate();
    } catch (err) {
      console.error("Failed to update DOI:", err);
      alert("Failed to update DOI");
    } finally {
      setProcessing(false);
    }
  }, [modal, doi, mutate]);

  const statusColors = {
    submitted: "bg-blue-100 text-blue-700 ring-blue-200",
    accepted: "bg-green-100 text-green-700 ring-green-200",
    rejected: "bg-red-100 text-red-700 ring-red-200",
    revise: "bg-amber-100 text-amber-700 ring-amber-200"
  };

  if (error) {
    return (
      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
        <h2 className="text-lg font-semibold text-slate-900">Paper Management</h2>
        <p className="mt-4 text-sm text-red-600">Failed to load papers</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Paper Management</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {Array.isArray(data) ? data.length : 0} papers
        </span>
      </div>
      
      <form onSubmit={doSearch} className="mt-4">
        <div className="relative">
          <input 
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-24 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
            placeholder="Search by title, abstract, or keyword..." 
            value={q} 
            onChange={(e) => setQ(e.target.value)}
          />
          <button 
            type="submit"
            disabled={searching || !q.trim()}
            className="absolute right-1.5 top-1.5 rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3 max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
            <p className="mt-3 text-sm text-slate-500">Loading papers...</p>
          </div>
        ) : Array.isArray(data) && data.length > 0 ? data.map((p) => (
          <PaperCard 
            key={p.id} 
            paper={p} 
            statusColors={statusColors}
            onDecide={decide}
            onScreen={openScreenModal}
            onAssignEditor={openEditorModal}
            onAssignReviewers={openReviewersModal}
            onSetDoi={openDoiModal}
            onViewDetails={setViewPaper}
            disabled={processing}
          />
        )) : (
          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">No papers found</p>
          </div>
        )}
        
        {Array.isArray(searchResults) && searchResults.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="text-sm font-semibold text-slate-900">Search Results ({searchResults.length})</p>
            <div className="mt-4 space-y-3">
              {searchResults.map((p) => (
                <PaperCard 
                  key={p.id} 
                  paper={p} 
                  statusColors={statusColors}
                  onDecide={decide}
                  onScreen={openScreenModal}
                  onAssignEditor={openEditorModal}
                  onAssignReviewers={openReviewersModal}
                  onSetDoi={openDoiModal}
                  onViewDetails={setViewPaper}
                  disabled={processing}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal && (
        <Modal
          modal={modal}
          onClose={() => setModal(null)}
          screened={screened}
          setScreened={setScreened}
          screeningNotes={screeningNotes}
          setScreeningNotes={setScreeningNotes}
          onSubmitScreen={submitScreen}
          editorId={editorId}
          setEditorId={setEditorId}
          users={users}
          onSubmitEditor={submitEditor}
          revQuery={revQuery}
          setRevQuery={setRevQuery}
          reviewerResults={reviewerResults}
          searchingReviewers={searchingReviewers}
          onSearchReviewers={searchReviewers}
          selectedReviewerIds={selectedReviewerIds}
          setSelectedReviewerIds={setSelectedReviewerIds}
          onAssignReviewers={assignReviewers}
          doi={doi}
          setDoi={setDoi}
          onSubmitDoi={submitDoi}
          processing={processing}
        />
      )}

      {viewPaper && (
        <PaperDetailsModal 
          paper={viewPaper} 
          onClose={() => setViewPaper(null)}
          statusColors={statusColors}
        />
      )}
    </section>
  );
}

function PaperCard({ paper, statusColors, onDecide, onScreen, onAssignEditor, onAssignReviewers, onSetDoi, onViewDetails, disabled }) {
  return (
    <div className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900 line-clamp-1">
              <Link href={`/papers/${paper.id}`} className="hover:text-blue-600">{paper.title}</Link>
            </p>
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${statusColors[paper.status] || statusColors.submitted}`}>
              {paper.status}
            </span>
            {paper.screened && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200">
                ✓ Screened
              </span>
            )}
            {paper.doi && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                DOI
              </span>
            )}
          </div>
          {paper.editorId && (
            <p className="mt-1 text-xs text-slate-500">Editor: {paper.editorId.slice(-6)}</p>
          )}
        </div>
        {paper.fileUrl && (
          <a 
            href={paper.fileUrl} 
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700" 
            target="_blank" 
            rel="noreferrer"
          >
            View Paper
          </a>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button 
          onClick={() => onViewDetails(paper)} 
          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200 transition-all hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          📄 View Details
        </button>
        <button 
          onClick={() => onDecide(paper.id, "published")} 
          className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 ring-1 ring-green-200 transition-all hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          ✓ Publish
        </button>
        <button 
          onClick={() => onDecide(paper.id, "revise")} 
          className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 transition-all hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          ↻ Revise
        </button>
        <button 
          onClick={() => onDecide(paper.id, "rejected")} 
          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-200 transition-all hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          ✕ Reject
        </button>
        <button 
          onClick={() => onScreen(paper)} 
          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200 transition-all hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          Screen
        </button>
        <button 
          onClick={() => onAssignEditor(paper)} 
          className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 ring-1 ring-purple-200 transition-all hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          Assign Editor
        </button>
        <button 
          onClick={() => onSetDoi(paper)} 
          className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition-all hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          Set DOI
        </button>
      </div>
    </div>
  );
}

function Modal({ 
  modal, 
  onClose, 
  screened, 
  setScreened, 
  screeningNotes, 
  setScreeningNotes, 
  onSubmitScreen,
  editorId,
  setEditorId,
  users,
  onSubmitEditor,
  revQuery,
  setRevQuery,
  reviewerResults,
  searchingReviewers,
  onSearchReviewers,
  selectedReviewerIds,
  setSelectedReviewerIds,
  onAssignReviewers,
  doi,
  setDoi,
  onSubmitDoi,
  processing
}) {
  const getTitle = () => {
    switch (modal.type) {
      case "screen": return "Admin Screening";
      case "editor": return "Assign Editor";
      case "reviewers": return "Assign Reviewers";
      case "doi": return "Set DOI";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{getTitle()}</h3>
          <button 
            onClick={onClose} 
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            disabled={processing}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {modal.type === "screen" && (
          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={screened} 
                onChange={(e) => setScreened(e.target.checked)}
                disabled={processing}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="text-sm font-medium text-slate-700">Mark as screened</span>
            </label>
            <textarea 
              className="w-full rounded-lg border border-slate-300 p-3 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
              rows={4} 
              placeholder="Add screening notes (optional)" 
              value={screeningNotes} 
              onChange={(e) => setScreeningNotes(e.target.value)}
              disabled={processing}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose} 
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={processing}
              >
                Cancel
              </button>
              <button 
                onClick={onSubmitScreen} 
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={processing}
              >
                {processing ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {modal.type === "editor" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-600">Select an editor to assign to this paper.</p>
            <select 
              className="w-full rounded-lg border border-slate-300 p-3 text-sm shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
              value={editorId} 
              onChange={(e) => setEditorId(e.target.value)}
              disabled={processing}
            >
              <option value="">Select an editor...</option>
              {Array.isArray(users) && users.filter((u) => u.role === "editor").map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose} 
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={processing}
              >
                Cancel
              </button>
              <button 
                disabled={!editorId || processing} 
                onClick={onSubmitEditor} 
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? "Assigning..." : "Assign Editor"}
              </button>
            </div>
          </div>
        )}

        {modal.type === "reviewers" && (
          <div className="mt-6 space-y-4">
            <form onSubmit={onSearchReviewers} className="relative">
              <input 
                className="w-full rounded-lg border border-slate-300 p-3 pr-24 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" 
                placeholder="Search reviewers by name or expertise..." 
                value={revQuery} 
                onChange={(e) => setRevQuery(e.target.value)}
                disabled={processing}
              />
              <button 
                type="submit"
                disabled={searchingReviewers || processing}
                className="absolute right-1.5 top-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchingReviewers ? "..." : "Search"}
              </button>
            </form>

            <div className="max-h-64 overflow-auto rounded-lg border border-slate-200">
              {searchingReviewers ? (
                <div className="p-8 text-center">
                  <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                  <p className="mt-3 text-sm text-slate-500">Searching reviewers...</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {Array.isArray(reviewerResults) && reviewerResults.length > 0 ? reviewerResults.map((r) => {
                    const checked = selectedReviewerIds.includes(r.id);
                    return (
                      <li key={r.id} className="flex items-center justify-between p-3 hover:bg-slate-50">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{r.name}</p>
                          <p className="text-sm text-slate-600 truncate">{r.email}</p>
                          {r.expertise && (
                            <p className="text-xs text-slate-500 mt-1">{r.expertise}</p>
                          )}
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer ml-3">
                          <input 
                            type="checkbox" 
                            checked={checked} 
                            onChange={(e) => {
                              setSelectedReviewerIds((prev) => 
                                e.target.checked ? [...prev, r.id] : prev.filter((x) => x !== r.id)
                              );
                            }}
                            disabled={processing}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className="text-sm font-medium text-slate-700">Select</span>
                        </label>
                      </li>
                    );
                  }) : (
                    <li className="p-8 text-center text-sm text-slate-500">
                      {reviewerResults === null ? "Search for reviewers to assign" : "No reviewers found"}
                    </li>
                  )}
                </ul>
              )}
            </div>

            {selectedReviewerIds.length > 0 && (
              <div className="rounded-lg bg-blue-50 p-3 ring-1 ring-blue-200">
                <p className="text-sm font-medium text-blue-900">
                  {selectedReviewerIds.length} reviewer{selectedReviewerIds.length !== 1 ? 's' : ''} selected
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose} 
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={processing}
              >
                Cancel
              </button>
              <button 
                disabled={selectedReviewerIds.length === 0 || processing} 
                onClick={onAssignReviewers}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processing ? "Assigning..." : `Assign ${selectedReviewerIds.length} Reviewer${selectedReviewerIds.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        )}

        {modal.type === "doi" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-slate-600">Set or update the DOI for this paper.</p>
            <input 
              className="w-full rounded-lg border border-slate-300 p-3 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed" 
              placeholder="10.xxxx/xxxxx" 
              value={doi} 
              onChange={(e) => setDoi(e.target.value)}
              disabled={processing}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={onClose} 
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={processing}
              >
                Cancel
              </button>
              <button 
                onClick={onSubmitDoi}
                disabled={processing}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Saving..." : "Save DOI"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaperDetailsModal({ paper, onClose, statusColors }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10 my-8">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-slate-900">Paper Details</h3>
            <p className="mt-1 text-sm text-slate-600">Complete information about this submission</p>
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

        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
            <p className="mt-1 text-base font-semibold text-slate-900">{paper.title}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Status</label>
              <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ring-1 ${statusColors[paper.status] || statusColors.submitted}`}>
                {paper.status}
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Screening</label>
              <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium ring-1 ${paper.screened ? "bg-green-100 text-green-700 ring-green-200" : "bg-slate-100 text-slate-600 ring-slate-200"}`}>
                {paper.screened ? "✓ Screened" : "Not Screened"}
              </span>
            </div>
          </div>

          {paper.doi && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">DOI</label>
              <p className="mt-1 font-mono text-sm text-slate-900">{paper.doi}</p>
            </div>
          )}

          {paper.abstract && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Abstract</label>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{paper.abstract}</p>
            </div>
          )}

          {Array.isArray(paper.keywords) && paper.keywords.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Keywords</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {paper.keywords.map((kw, i) => (
                  <span key={i} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(paper.authors) && paper.authors.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Authors</label>
              <div className="mt-2 space-y-2">
                {paper.authors.map((author, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200">
                    <p className="font-medium text-slate-900">{author.name}</p>
                    {author.email && <p className="text-sm text-slate-600">{author.email}</p>}
                    {author.affiliation && <p className="text-xs text-slate-500">{author.affiliation}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {paper.editorId && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned Editor</label>
              <p className="mt-1 text-sm text-slate-900">Editor ID: {paper.editorId}</p>
            </div>
          )}

          {paper.screeningNotes && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Screening Notes</label>
              <div className="mt-1 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
                <p className="text-sm text-amber-900 whitespace-pre-wrap">{paper.screeningNotes}</p>
              </div>
            </div>
          )}

          {Array.isArray(paper.reviewerInvites) && paper.reviewerInvites.length > 0 && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Reviewer Invites</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {paper.reviewerInvites.map((ri, i) => {
                  const statusColor = ri.status === "accepted" 
                    ? "bg-green-50 text-green-700 ring-green-200" 
                    : ri.status === "declined" 
                    ? "bg-red-50 text-red-700 ring-red-200" 
                    : "bg-blue-50 text-blue-700 ring-blue-200";
                  return (
                    <div key={i} className={`rounded-lg p-3 ring-1 ${statusColor}`}>
                      <p className="text-xs font-medium">Reviewer: {ri.reviewerId?.slice(-8)}</p>
                      <p className="mt-1 text-xs capitalize">{ri.status}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {paper.fileUrl && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Document</label>
              <a 
                href={paper.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Paper
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose} 
            className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}


// "use client";

// import MetricsPanel from "./components/MetricsPanel";
// import UsersPanel from "./components/UsersPanel";
// import PapersPanel from "./components/PapersPanel";

// export default function AdminConsole() {
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       <div className="mx-auto max-w-7xl p-6 sm:p-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
//           <p className="mt-1 text-sm text-slate-600">Manage users, papers, and system metrics</p>
//         </div>
//         <MetricsPanel />
//         <div className="mt-8 grid gap-8 lg:grid-cols-2">
//           <UsersPanel />
//           <PapersPanel />
//         </div>
//       </div>
//     </main>
//   );
// }