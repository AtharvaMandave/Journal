import { connect } from "../../../lib/mongoose";
import { IssueModel } from "../../../models/Issue";
import { PaperModel } from "../../../models/Paper";
import Image from "next/image";

export const dynamic = "force-static";

export default async function CurrentIssuePage() {
  await connect();
  const latest = await IssueModel.findOne({ publishedAt: { $ne: null } })
    .sort({ publishedAt: -1 })
    .lean();
  let papers = [];
  if (latest) {
    const list = await PaperModel.find({ issueId: latest._id, status: "published" }).select("title fileUrl").lean();
    papers = list.map((p) => ({ id: String(p._id), title: p.title, fileUrl: p.fileUrl || "" }));
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Current Issue
          </h1>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>

        {latest ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cover Image & Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5">
                {latest.coverImageUrl ? (
                  <div className="mb-6 overflow-hidden rounded-lg shadow-md">
                    <Image
                      alt="Journal Cover"
                      src={latest.coverImageUrl}
                      width={400}
                      height={400}
                      className="h-auto w-full object-cover transition-transform duration-300 hover:scale-105"
                      unoptimized
                      priority
                    />
                  </div>
                ) : (
                  <div className="mb-6 flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                    <div className="text-center">
                      <svg className="mx-auto h-16 w-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="mt-2 text-sm font-medium text-slate-600">Journal Cover</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                    <p className="text-sm font-medium opacity-90">Volume & Issue</p>
                    <p className="mt-1 text-2xl font-bold">
                      Vol. {latest.volume}, No. {latest.issueNumber}
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-600">Publication Year</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{latest.year}</p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm font-medium text-slate-600">Total Articles</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{papers.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Papers List */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5">
                <h2 className="mb-6 text-2xl font-bold text-slate-900">Published Articles</h2>
                
                {papers.length > 0 ? (
                  <div className="space-y-4">
                    {papers.map((p, index) => (
                      <article
                        key={p.id}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300"
                      >
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-blue-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                {index + 1}
                              </span>
                              <span className="text-xs font-medium text-slate-500">Article</span>
                            </div>
                            <h3 className="text-lg font-semibold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
                              {p.title}
                            </h3>
                          </div>
                          
                          {p.fileUrl ? (
                            <a
                              href={p.fileUrl}
                              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-105"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              PDF
                            </a>
                          ) : null}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg bg-slate-50 p-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-4 text-base font-medium text-slate-600">No published papers yet</p>
                    <p className="mt-1 text-sm text-slate-500">Articles will appear here once published</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-16 text-center shadow-lg ring-1 ring-slate-900/5">
            <div className="mx-auto max-w-md">
              <svg className="mx-auto h-16 w-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">No Published Issues Yet</h3>
              <p className="mt-2 text-base text-slate-600">The current issue will be displayed here once published</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}