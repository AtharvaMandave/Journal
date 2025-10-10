import { connect } from "../../../lib/mongoose";
import { PaperModel } from "../../../models/Paper";

// Revalidate this page frequently to keep it up-to-date
export const revalidate = 60; // Revalidate every 60 seconds

export default async function CurrentArchivesPage() {
  try {
    await connect();

    // Use UTC time to avoid timezone issues
    const now = new Date();
    const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0));

    console.log('Searching for papers published after:', startOfMonth);

    // Debug: Check all papers with status "published"
    const allPublishedPapers = await PaperModel.find({
      status: "published",
    })
      .select("title fileUrl publishedAt status")
      .sort({ publishedAt: -1 })
      .lean();

    console.log('Total published papers in database:', allPublishedPapers.length);
    console.log('Sample papers:', allPublishedPapers.slice(0, 3).map(p => ({
      title: p.title,
      publishedAt: p.publishedAt,
      publishedAtType: typeof p.publishedAt,
      status: p.status
    })));

    const papersList = await PaperModel.find({
      status: "published",
      publishedAt: { $gte: startOfMonth },
    })
      .select("title fileUrl publishedAt")
      .sort({ publishedAt: -1 })
      .lean();

    console.log('Papers published this month:', papersList.length);

    const papers = papersList.map((p) => ({
      id: String(p._id),
      title: p.title,
      fileUrl: p.fileUrl || "",
      publishedAt: p.publishedAt,
    }));

    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Current Archives
            </h1>
            <p className="mt-2 text-lg text-slate-600">Papers published this month</p>
            <div className="mt-3 h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </div>

          {/* Papers List */}
          <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-900/5">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">Published This Month</h2>
            
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
                          <p className="text-sm text-slate-600">
                            Published on: {new Date(p.publishedAt).toLocaleDateString()}
                          </p>
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
                <p className="mt-4 text-base font-medium text-slate-600">No papers published this month</p>
                <p className="mt-1 text-sm text-slate-500">New articles will appear here once published.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading papers:', error);
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-red-900/5">
            <p className="text-red-600">Error loading papers. Please try again later.</p>
          </div>
        </div>
      </main>
    );
  }
}