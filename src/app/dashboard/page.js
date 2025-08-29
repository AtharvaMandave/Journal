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
    <main className="p-8 sm:p-20 bg-black text-white">
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
        onClick={() => signOut()}
        className="mt-6 px-4 py-2 border rounded text-white hover:bg-gray-800"
      >
        Sign out
      </button>

      <section className="mt-10">
        <h2 className="text-xl font-medium">Your submissions</h2>
        <div className="mt-4 grid gap-3">
          {data && Array.isArray(data) && data.length > 0 ? (
            data.map((p) => (
              <div key={p.id} className="rounded border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-sm text-gray-400">Status: {p.status}</p>
                  </div>
                  {p.fileUrl ? (
                    <a
                      className="text-sm underline"
                      href={p.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      PDF
                    </a>
                  ) : null}
                </div>
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
