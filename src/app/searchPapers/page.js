"use client";

import { useState } from "react";
import { Search, FileText, Calendar } from "lucide-react";

export default function SearchPapersPage() {
  const [q, setQ] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!q.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/arch?q=${encodeURIComponent(q)}`);
      
      if (!res.ok) {
        console.error("API error:", res.status, res.statusText);
        setData([]);
        return;
      }

      const text = await res.text();
      if (!text) {
        console.error("Empty response from API");
        setData([]);
        return;
      }

      const result = JSON.parse(text);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Search failed:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">ResearchHub</h1>
          </div>
          <div className="text-sm text-gray-600">Papers Database</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="mb-12">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Search Papers</h2>
            <p className="text-gray-600">Find research papers by title, keywords, or abstract</p>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter keywords, title or topic..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !q.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Searching papers...</span>
              </div>
            </div>
          )}

          {!loading && searched && data.length === 0 && (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No papers found</h3>
              <p className="text-gray-600">Try different keywords or search terms</p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <>
              <div className="mb-6">
                <p className="text-sm text-gray-600 font-medium">
                  {data.length} result{data.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <div className="space-y-4">
                {data.map((paper) => (
                  <div
                    key={paper.id}
                    className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 leading-snug">
                          {paper.title}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(paper.publishedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      {paper.fileUrl && (
                        <a
                          href={paper.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!searched && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">Start searching to find papers</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}