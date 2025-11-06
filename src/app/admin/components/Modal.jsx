"use client";

export default function Modal({ 
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