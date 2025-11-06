"use client";

import useSWR from "swr";
import { fetcher } from "../../../../lib/axios";

export default function MetricsPanel() {
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
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Last 30 days
        </span>
      </div>
      {isLoading ? (
        <LoadingSpinner message="Loading metrics..." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Stat label="Submissions" value={data?.submissionsLast30 || 0} trend="+12%" />
          <Stat label="Accepted" value={data?.acceptedLast30 || 0} trend="+8%" />
          <Stat label="Acceptance Rate" value={`${Math.round((data?.acceptanceRate || 0) * 100)}%`} />
          <TopReviewers reviewers={data?.topReviewerActivity || []} />
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

function TopReviewers({ reviewers }) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-4 ring-1 ring-blue-100">
      <p className="text-sm font-semibold text-slate-900">Top Reviewers</p>
      <ul className="mt-3 space-y-2">
        {reviewers.slice(0, 3).map((r, i) => (
          <li key={i} className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Reviewer {r.reviewerId?.slice(-4)}</span>
            <span className="rounded-full bg-white px-2 py-0.5 text-slate-600">{r.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoadingSpinner({ message }) {
  return (
    <div className="mt-6 flex items-center justify-center py-8">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
      <p className="ml-3 text-sm text-slate-500">{message}</p>
    </div>
  );
}