'use client'
import Link from "next/link";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import useSWR from "swr";

export default function Home() {
  const { data: cfp } = useSWR("/api/public/announcements", (u) => fetch(u).then((r) => r.json()));
  const { data: recent } = useSWR("/api/public/recent-papers", (u) => fetch(u).then((r) => r.json()));

  return (
    <main>
      {Array.isArray(cfp) && cfp.length > 0 ? (
        <div className="bg-white-50 border-b border-yellow-200">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm">
            <p className="text-yellow-900"><strong>Call for Papers:</strong> {cfp[0].title} {cfp[0].deadline ? `— Deadline: ${new Date(cfp[0].deadline).toLocaleDateString()}` : ""} <Link href="/submit" className="underline">Submit now</Link></p>
          </div>
        </div>
      ) : null}

      <section className="relative overflow-hidden bg-black">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:py-28 sm:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2 ">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                A modern, open-access academic journal
              </h1>
              <p className="mt-5 max-w-xl text-gray-600">
                Submit your research, review papers, and explore the latest issues—all in one place.
              </p>
              <div className="mt-8 flex gap-3">
                <Link href="/submit"><Button size="lg">Submit a Paper</Button></Link>
                <Link href="/current-issue"><Button className="text-white hover:bg-black" variant="outline" size="lg">Read Current Issue</Button></Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
              <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold">Why publish with us</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-white">
            <Feature title="Rigorous peer review" desc="A fair, double-blind review process led by expert reviewers." />
            <Feature title="Fast publication" desc="Streamlined workflows help your work reach readers sooner." />
            <Feature title="Open access" desc="Your research is accessible to everyone, everywhere." />
            <Feature title="Editorial excellence" desc="An experienced editorial board ensures high-quality standards." />
            <Feature title="Discoverability" desc="Optimized metadata and search help your work get found." />
            <Feature title="Author support" desc="Clear guidance at every step from submission to publication." />
          </div>
        </div>
      </section>

      <section className="border-t bg-black">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold">Recent Papers</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(recent) && recent.length > 0 ? recent.map((p) => (
              <div key={p.id} className="rounded-2xl border p-4">
                <Link href={`/papers/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
                <div className="mt-3 flex items-center gap-2">
                  {p.fileUrl ? <a className="inline-flex items-center rounded-2xl border px-3 py-1.5 text-sm" href={p.fileUrl} target="_blank" rel="noreferrer">Download PDF</a> : null}
                </div>
              </div>
            )) : <p className="text-sm text-white-600">No recent publications yet.</p>}
          </div>
        </div>
      </section>

      <section className="border-t bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 text-white">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold text-white">Ready to contribute?</h3>
            <p className="mt-3 max-w-2xl text-white">
              Join our community of researchers. Start a new submission in minutes.
            </p>
            <div className="mt-6">
              <div className="flex flex-wrap justify-center gap-3 text-white">
                <Link href="/register"><Button size="lg" className="text-white">Create an Account</Button></Link>
                <Link href="/login"><Button variant="outline" size="lg">Login</Button></Link>
                <Link href="/about"><Button variant="outline" size="lg">About</Button></Link>
                <Link href="/archives"><Button variant="outline" size="lg">Archives</Button></Link>
                <Link href="/editorial-board"><Button variant="outline" size="lg">Editorial Board</Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-base font-medium">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}
