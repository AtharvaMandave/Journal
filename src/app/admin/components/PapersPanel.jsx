"use client";

import useSWR from "swr";
import { useState, useCallback } from "react";
import { fetcher } from "../../../../lib/axios";
import PaperCard from "./PaperCard";
import Modal from "./Modal";
import PaperDetailsModal from "./PaperDetailsModal";
import SearchBar from "./SearchBar";

export default function PapersPanel() {
  const { data, mutate, error, isLoading } = useSWR("/editor/submitted", fetcher);
  const { data: users } = useSWR("/admin/users", fetcher);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [modal, setModal] = useState(null);
  const [viewPaper, setViewPaper] = useState(null);
  const [processing, setProcessing] = useState(false);

  const doSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      const response = await api.get(`/admin/search-papers?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error("Search failed:", err);
      alert("Failed to search papers");
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

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
      
      <SearchBar 
        query={searchQuery}
        setQuery={setSearchQuery}
        onSearch={doSearch}
        searching={searching}
      />

      <div className="mt-6 space-y-3 max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          <LoadingState />
        ) : Array.isArray(data) && data.length > 0 ? (
          data.map((paper) => (
            <PaperCard 
              key={paper.id} 
              paper={paper} 
              statusColors={statusColors}
              onDecide={decide}
              onScreen={() => setModal({ type: "screen", paper })}
              onAssignEditor={() => setModal({ type: "editor", paper })}
              onAssignReviewers={() => setModal({ type: "reviewers", paper })}
              onSetDoi={() => setModal({ type: "doi", paper })}
              onViewDetails={setViewPaper}
              disabled={processing}
            />
          ))
        ) : (
          <EmptyState message="No papers found" />
        )}
        
        {Array.isArray(searchResults) && searchResults.length > 0 && (
          <SearchResults 
            results={searchResults}
            statusColors={statusColors}
            onDecide={decide}
            onScreen={(paper) => setModal({ type: "screen", paper })}
            onAssignEditor={(paper) => setModal({ type: "editor", paper })}
            onAssignReviewers={(paper) => setModal({ type: "reviewers", paper })}
            onSetDoi={(paper) => setModal({ type: "doi", paper })}
            onViewDetails={setViewPaper}
            processing={processing}
          />
        )}
      </div>

      {modal && (
        <PaperModals
          modal={modal}
          onClose={() => setModal(null)}
          users={users}
          mutate={mutate}
          processing={processing}
          setProcessing={setProcessing}
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

function LoadingState() {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
      <p className="mt-3 text-sm text-slate-500">Loading papers...</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-12 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

function SearchResults({ results, ...props }) {
  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <p className="text-sm font-semibold text-slate-900">Search Results ({results.length})</p>
      <div className="mt-4 space-y-3">
        {results.map((paper) => (
          <PaperCard key={paper.id} paper={paper} {...props} />
        ))}
      </div>
    </div>
  );
}