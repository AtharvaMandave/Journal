"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import useSWR from "swr";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data } = useSWR(
    status === "authenticated" ? "/api/my-papers" : null,
    (url) => fetch(url).then((r) => r.json())
  );

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [router, status]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* User info */}
        {session?.user && (
          <div className="mb-12">
            <p className="text-gray-600 text-sm">Welcome back</p>
            <p className="text-gray-900 font-medium mt-1">
              {session.user.email || session.user.name}
              {session.user.role && (
                <span className="text-gray-500 font-normal">
                  {" "}
                  • {session.user.role}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Submissions */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Your submissions
          </h2>

          <div className="space-y-3">
            {data && Array.isArray(data) && data.length > 0 ? (
              data.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{p.title}</p>
                    {/* Paper ID displayed here */}
                    <p className="text-xs text-gray-500 mt-1">
                      Paper ID: {p.id}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
                        {p.status}
                      </span>
                      {p.fileUrl && (
                        <a
                          href={p.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View PDF
                        </a>
                      )}
                    </div>
                  </div>

                  {p.status === "revise" && (
                    <Link
                      href={`/submit?revise=${p.id}`}
                      className="ml-4 px-3 py-1.5 text-sm text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition font-medium"
                    >
                      Revise
                    </Link>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No submissions yet.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
