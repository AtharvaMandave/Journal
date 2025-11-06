"use client";

export default function PaperDetailsModal({ paper, onClose, statusColors }) {
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