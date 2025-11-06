"use client";

import Link from "next/link";

export default function PaperCard({
  paper,
  statusColors,
  onDecide,
  onScreen,
  onAssignEditor,
  onAssignReviewers,
  onSetDoi,
  onViewDetails,
  disabled,
}) {
  // ✅ Guard: if paper is not yet loaded, show skeleton/placeholder
  if (!paper) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 animate-pulse">
        <p className="h-4 w-1/2 bg-slate-200 rounded mb-2"></p>
        <p className="h-3 w-1/4 bg-slate-200 rounded"></p>
      </div>
    );
  }

  return (
    <div className="group rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900 line-clamp-1">
              <Link
                href={paper?.id ? `/papers/${paper.id}` : "#"}
                className="hover:text-blue-600"
              >
                {paper?.title || "Untitled Paper"}
              </Link>
            </p>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
                (paper?.status && statusColors[paper.status]) ||
                statusColors.submitted
              }`}
            >
              {paper?.status || "submitted"}
            </span>

            {paper?.screened && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200">
                ✓ Screened
              </span>
            )}

            {paper?.doi && (
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200">
                DOI
              </span>
            )}
          </div>

          {paper?.editorId && (
            <p className="mt-1 text-xs text-slate-500">
              Editor: {paper?.editorId?.slice(-6)}
            </p>
          )}
        </div>

        {paper?.fileUrl && (
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
          onClick={() => onViewDetails?.(paper)}
          className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-200 transition-all hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!paper?.id || disabled}
        >
          📄 View Details
        </button>

        <button
          onClick={() => onDecide?.(paper?.id, "published")}
          className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 ring-1 ring-green-200 transition-all hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!paper?.id || disabled}
        >
          ✓ Publish
        </button>

        <button
          onClick={() => onDecide?.(paper?.id, "revise")}
          className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200 transition-all hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!paper?.id || disabled}
        >
          ↻ Revise
        </button>

        <button
          onClick={() => onDecide?.(paper?.id, "rejected")}
          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-200 transition-all hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!paper?.id || disabled}
        >
          ✕ Reject
        </button>

        <button
          onClick={() => onScreen?.(paper)}
          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200 transition-all hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!paper?.id || disabled}
        >
          Screen
        </button>

        <button
          onClick={() => onAssignEditor?.(paper)}
          className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 ring-1 ring-purple-200 transition-all hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!paper?.id || disabled}
        >
          Assign Editor
        </button>

        <button
          onClick={() => onSetDoi?.(paper)}
          className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition-all hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!paper?.id || disabled}
        >
          Set DOI
        </button>
      </div>
    </div>
  );
}
