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
      <main className="p-8 sm:p-20 bg-black text-white">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 sm:p-20 text-gray-900">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {/* <Link href='/dashboard/admin-dash'>Admin Dashboard</Link> */}
      {session?.user ? (
        <p className="mt-4 text-gray-300">
          You are signed in as <span className="font-semibold">{session.user.role}</span>
        </p>
      ) : (
        <p className="mt-4 text-gray-300">You are not signed in</p>
      )}

      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-6 px-4 py-2 rounded border hover:bg-gray-100"
      >
        Sign out
      </button>

      <section className="mt-10">
        <h2 className="text-xl font-medium">Your submissions</h2>
        <div className="mt-4 grid gap-3">
          {data && Array.isArray(data) && data.length > 0 ? (
            data.map((p) => (
              <div key={p.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <div className="mt-1 text-xs text-gray-600">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1">Status: {p.status}</span>
                    </div>
                  </div>
                  {p.fileUrl ? (
                    <a className="text-sm underline" href={p.fileUrl} target="_blank" rel="noreferrer">PDF</a>
                  ) : null}
                </div>
                {p.status === "revise" ? (
                  <div className="mt-3">
                    <Link href={`/submit?revise=${p.id}`} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">Revise / Resubmit</Link>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No submissions yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
