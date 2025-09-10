'use client'
import Link from "next/link";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import useSWR from "swr";

export default function Home() {
  const { data: cfp } = useSWR("/api/public/announcements", (u) => fetch(u).then((r) => r.json()));
  const { data: recent } = useSWR("/api/public/recent-papers", (u) => fetch(u).then((r) => r.json()));

  return (
    <main className="bg-gray-50">
      {/* Header with Journal Title */}
      <section className="bg-white border-b-2 border-green-500">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center">
              <div className="text-white font-bold text-xl">J</div>
            </div> */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-600 uppercase tracking-wide">
                TechnoScholars 
              
              </h1>
              <p className="text-gray-600 text-sm mt-1">(Peer-Reviewed, Open Access, Fully Refereed International Journal)</p>
              <p className="text-red-600 font-semibold text-sm">ISSN: 2582-5208</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call for Papers Banner */}
      {Array.isArray(cfp) && cfp.length > 0 && (
        <div className="bg-yellow-100 border-b border-yellow-300">
          <div className="mx-auto max-w-7xl px-4 py-3 text-center">
            <p className="text-yellow-900 font-semibold">
              <strong>📢 Call for Papers:</strong> {cfp[0].title} 
              {cfp[0].deadline && ` — Deadline: ${new Date(cfp[0].deadline).toLocaleDateString()}`}
              <Link href="/submit" className="ml-2 underline hover:no-underline">Submit Now</Link>
            </p>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-2xl font-bold text-green-600 mb-8">Welcome to TechnoScholars </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Impact Factor Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white text-center">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-800">8.187</span>
              </div>
              <h3 className="font-semibold mb-4">High Impact Factor</h3>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-green-600 rounded-lg p-2">
                  <div className="font-semibold">Free</div>
                  <div>open access journal</div>
                </div>
                <div className="bg-green-600 rounded-lg p-2">
                  <div className="font-semibold">Most-Cited</div>
                  <div>Publisher</div>
                </div>
                <div className="bg-green-600 rounded-lg p-2">
                  <div className="font-semibold">Low cost</div>
                  <div>Journal</div>
                </div>
                <div className="bg-green-600 rounded-lg p-2">
                  <div className="font-semibold">Fast</div>
                  <div>paper publication</div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Submit Paper */}
                <div className="bg-green-600 rounded-xl p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Submit Your Paper Online</h3>
                  <p className="mb-4 opacity-90">low cost journal, fast publication</p>
                  <Link href="/submit">
                    <Button className="bg-gray-900 hover:bg-gray-900 text-black ">
                      Submit Now
                    </Button>
                  </Link>
                </div>

                {/* Call for Paper */}
                <div className="bg-green-600 rounded-xl p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Call For Paper</h3>
                  <div className="space-y-1 text-sm">
                    <p>Submission Last Date: <strong>30 Sep 2025</strong></p>
                    <p>Review Status: <strong>24 to 48 Hours</strong></p>
                    <p>Fast Paper Publication: <strong>4 hours</strong></p>
                    <p className="font-semibold">DOI Service Started</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-white border rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Latest News</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>helps in splitting the knowledge.</p>
                <p>DOI services started for both already published paper and for new submission</p>
              </div>
              
              <div className="mt-6">
                <h4 className="font-bold text-gray-800 mb-3">INDEXING</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="font-bold text-sm">DOI</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">SS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journal Description */}
      <section className="bg-white py-8 border-t">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-green-600 text-white p-4 rounded-lg">
                <h3 className="font-bold mb-3">FOR AUTHORS</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:underline">📄 Call for Paper</Link></li>
                  <li><Link href="#" className="hover:underline">📋 Publication Process</Link></li>
                  <li><Link href="#" className="hover:underline">📝 Submit Paper Online</Link></li>
                  <li><Link href="#" className="hover:underline">💳 Pay Publication Fee</Link></li>
                  <li><Link href="#" className="hover:underline">📑 Paper Format</Link></li>
                  <li><Link href="#" className="hover:underline">📋 Copyright Form</Link></li>
                  <li><Link href="#" className="hover:underline">🔍 Track Paper</Link></li>
                  <li><Link href="#" className="hover:underline">📊 Indexing</Link></li>
                  <li><Link href="#" className="hover:underline">👥 Editorial Board</Link></li>
                </ul>
              </div>

              <div className="bg-green-600 text-white p-4 rounded-lg">
                <h3 className="font-bold mb-3">PUBLICATION</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="#" className="hover:underline">📖 Current Issue</Link></li>
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <p className="text-gray-700 leading-relaxed mb-6">
                IRJMETS is Fast Paper publication, low cost journal, peer-reviewed, Open Access, Fast processing journal that 
                publishes original research articles as well as review articles in several areas of engineering, science and 
                technology for the enhancement of scientific research work from its enables to readers to access the published 
                articles free of cost which helps in splitting the knowledge, thereby guaranteeing, scholar, scientist, academician, 
                Engineer and students of engineering and technology for reading, reprinting, distributing to facilitate academic 
                and research activities.
              </p>

              <h3 className="text-xl font-bold text-gray-800 mb-4">Our Journal Services:</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Low cost Journal</li>
                  <li>• Fast response after received paper within 6 hours.</li>
                  <li>• Fast paper publication within 4 hours after receiving publication fees and copyright form.</li>
                  <li>• Provide DOI</li>
                  <li>• Low publication fees.</li>
                  <li>• Paper id is provided to track paper process.</li>
                  <li>• Simple and fast paper submission process.</li>
                  <li>• Free open access journal. Monthly paper publication.</li>
                </ul>
                
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Provide free soft copy of certificate of publication to each author.</li>
                  <li>• Provide hard copy of paper publication certificate to each author</li>
                  <li>• Secure payment gateway.</li>
                  <li>• Strictly goes through plagiarism process.</li>
                  <li>• Paper can be submitted by authors any day any time.</li>
                  <li>• Accepted paper publication fees paid by authors online by Debit Card/ Credit Card/Net Banking/ Paytm /Phone Pe/ Bhim/Googlepay or any other UPI app</li>
                  <li>• Publication Guidelines - COPE Guidelines 24*7 authors query or problem resolving system</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Papers */}
      <section className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Papers</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(recent) && recent.length > 0 ? recent.map((p) => (
              <div key={p.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                <Link href={`/papers/${p.id}`} className="font-medium text-green-600 hover:underline block mb-3">
                  {p.title}
                </Link>
                <div className="flex items-center gap-2">
                  {p.fileUrl && (
                    <a 
                      className="inline-flex items-center bg-green-100 text-green-700 rounded-full px-3 py-1.5 text-sm hover:bg-green-200 transition-colors" 
                      href={p.fileUrl} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      📄 Download PDF
                    </a>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-gray-600 col-span-full text-center py-8">No recent publications yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-600 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to contribute?</h3>
          <p className="mb-6 opacity-90">Join our community of researchers. Start a new submission in minutes.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 text-white  hover:text-green-600 border-1 border-white hover:bg-white">
                Create an Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                Login
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                About
              </Button>
            </Link>
            <Link href="/archives">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                Archives
              </Button>
            </Link>
            <Link href="/editorial-board">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-green-600">
                Editorial Board
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}