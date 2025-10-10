'use client'
import { motion } from 'framer-motion';
import { FileText, Award, Zap, Globe, CheckCircle, Download } from 'lucide-react';
import useSWR from 'swr';
import Link from 'next/link';

export default function Home() {
  const { data: cfp, error: cfpError } = useSWR('/api/public/announcements', (url) => fetch(url).then(res => res.json()));
  const { data: recent, error: recentError } = useSWR('/api/public/recent-papers', (url) => fetch(url).then(res => res.json()));

  return (
    <main className="bg-gray-50">
      {/* Header with Journal Title */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border-b-2 border-green-500 shadow-sm"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-lg"
              aria-label="TechnoScholars Journal Logo"
            >
              <div className="text-white font-bold text-2xl">T</div>
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-600 uppercase tracking-wide">
                TechnoScholars
              </h1>
              <p className="text-gray-600 text-sm mt-1">(Peer-Reviewed, Open Access, Fully Refereed International Journal)</p>
              <p className="text-red-600 font-semibold text-sm">ISSN: 2582-5208</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Call for Papers Banner */}
      {cfpError && <div className="text-center py-4 text-red-500">Failed to load announcements.</div>}
      {!cfp && !cfpError && <div className="text-center py-4">Loading announcements...</div>}
      {Array.isArray(cfp) && cfp.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-b border-yellow-300"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 text-center">
            <p className="text-yellow-900 font-semibold flex items-center justify-center gap-2 flex-wrap">
              <strong className="flex items-center gap-1">
                <Zap className="w-4 h-4" /> Call for Papers:
              </strong> {cfp[0].title}
              {cfp[0].deadline && ` — Deadline: ${new Date(cfp[0].deadline).toLocaleDateString()}`}
              <Link href="/call-for-paper" className="ml-2 underline hover:no-underline text-green-600 font-bold">Submit Now</Link>
            </p>
          </div>
        </motion.div>
      )}

      {/* Welcome Section */}
      <section className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-2xl font-bold text-green-600 mb-8"
          >
            Welcome to TechnoScholars
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Impact Factor Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-6 text-white text-center shadow-xl"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
              >
                <span className="text-2xl font-bold text-green-800">8.187</span>
              </motion.div>
              <h3 className="font-semibold mb-4 text-lg">High Impact Factor</h3>

              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { icon: Globe, label: 'Free', sublabel: 'open access journal' },
                  { icon: Award, label: 'Most-Cited', sublabel: 'Publisher' },
                  { icon: CheckCircle, label: 'Low cost', sublabel: 'Journal' },
                  { icon: Zap, label: 'Fast', sublabel: 'paper publication' }
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    whileHover={{ scale: 1.05 }}
                    className="bg-green-600 rounded-lg p-2 cursor-pointer transition-all hover:bg-green-500"
                  >
                    <item.icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs">{item.sublabel}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Submit Paper */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg cursor-pointer"
                >
                  <FileText className="w-10 h-10 mb-3 opacity-90" />
                  <h3 className="text-2xl font-bold mb-2">Submit Your Paper Online</h3>
                  <p className="mb-4 opacity-90">low cost journal, fast publication</p>
                  <Link href="/submit">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                      Submit Now
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Call for Paper */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg"
                >
                  <h3 className="text-2xl font-bold mb-2">Call For Paper</h3>
                  <div className="space-y-1 text-sm">
                    <p className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Submission Last Date: <strong>30 Sep 2025</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Review Status: <strong>24 to 48 Hours</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Fast Paper Publication: <strong>4 hours</strong>
                    </p>
                    <p className="font-semibold flex items-center gap-2 mt-2 bg-yellow-400 text-green-800 px-3 py-1 rounded-full inline-block">
                      <Zap className="w-4 h-4" />
                      DOI Service Started
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Latest News */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Latest News</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-2"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  helps in splitting the knowledge.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-2"
                >
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                  DOI services started for both already published paper and for new submission
                </motion.p>
              </div>

              <div className="mt-6">
                <h4 className="font-bold text-gray-800 mb-3">INDEXING</h4>
                <div className="flex items-center space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <span className="font-bold text-sm">DOI</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-md cursor-pointer"
                  >
                    <span className="text-white font-bold text-xs">SS</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Journal Description */}
      <section className="bg-white py-8 border-t">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 rounded-lg shadow-lg">
                <h3 className="font-bold mb-3 text-lg">FOR AUTHORS</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: '/call-for-paper', icon: '📄', label: 'Call for Paper' },
                    { href: '/publication-process', icon: '📋', label: 'Publication Process' },
                    { href: '/submit', icon: '📝', label: 'Submit Paper Online' },
                    { href: '/publication-fees', icon: '💳', label: 'Pay Publication Fee' },
                    { href: '/pdfs/paper-format.pdf', icon: '📑', label: 'Paper Format', download: true },
                    { href: '/pdfs/copyright-form.pdf', icon: '📋', label: 'Copyright Form', download: true },
                    { href: '/check-status', icon: '🔍', label: 'Track Paper' },
                    { href: '/indexing', icon: '📊', label: 'Indexing' },
                    { href: '/editorial-board', icon: '👥', label: 'Editorial Board' }
                  ].map((item) => (
                    <motion.li
                      key={item.href}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        download={item.download}
                        className="hover:underline flex items-center gap-2"
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-600 to-green-700 text-white p-4 rounded-lg shadow-lg"
              >
                <h3 className="font-bold mb-3 text-lg">PUBLICATION</h3>
                <ul className="space-y-2 text-sm">
                  <motion.li whileHover={{ x: 5 }}>
                    <Link href="/current-issue" className="hover:underline flex items-center gap-2">
                      <span>📖</span>
                      Current Issue
                    </Link>
                  </motion.li>
                </ul>
              </motion.div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
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
                  {[
                    'Low cost Journal',
                    'Fast response after received paper within 6 hours.',
                    'Fast paper publication within 4 hours after receiving publication fees and copyright form.',
                    'Provide DOI',
                    'Low publication fees.',
                    'Paper id is provided to track paper process.',
                    'Simple and fast paper submission process.',
                    'Free open access journal. Monthly paper publication.'
                  ].map((service, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {service}
                    </motion.li>
                  ))}
                </ul>

                <ul className="space-y-2 text-sm text-gray-700">
                  {[
                    'Provide free soft copy of certificate of publication to each author.',
                    'Provide hard copy of paper publication certificate to each author',
                    'Secure payment gateway.',
                    'Strictly goes through plagiarism process.',
                    'Paper can be submitted by authors any day any time.',
                    'Accepted paper publication fees paid by authors online by Debit Card/ Credit Card/Net Banking/ Paytm /Phone Pe/ Bhim/Googlepay or any other UPI app',
                    'Publication Guidelines - COPE Guidelines 24*7 authors query or problem resolving system'
                  ].map((service, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {service}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Papers */}
      <section className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-gray-900 mb-6"
          >
            Recent Papers
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentError && <p className="text-gray-600 col-span-full text-center py-8">Failed to load recent papers.</p>}
            {!recent && !recentError && <p className="text-gray-600 col-span-full text-center py-8">Loading recent papers...</p>}
            {Array.isArray(recent) && recent.length > 0 ? recent.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-green-500 hover:shadow-lg transition-all"
              >
                <Link href={`/papers/${p.id}`} className="font-medium text-green-600 hover:underline block mb-3">
                  {p.title}
                </Link>
                <div className="flex items-center gap-2">
                  {p.fileUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 bg-green-100 text-green-700 rounded-full px-3 py-1.5 text-sm hover:bg-green-600 hover:text-white transition-colors"
                      href={p.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </motion.a>
                  )}
                </div>
              </motion.div>
            )) : (
              <p className="text-gray-600 col-span-full text-center py-8">No recent publications yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-green-600 to-green-700 text-white py-12"
      >
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to contribute?</h3>
          <p className="mb-6 opacity-90">Join our community of researchers. Start a new submission in minutes.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/register', label: 'Create an Account', variant: 'solid' },
              { href: '/login', label: 'Login', variant: 'outline' },
              { href: '/about', label: 'About', variant: 'outline' },
              { href: '/archives', label: 'Archives', variant: 'outline' },
              { href: '/editorial-board', label: 'Editorial Board', variant: 'outline' }
            ].map((btn, i) => (
              <motion.a
                key={btn.href}
                href={btn.href}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  btn.variant === 'solid'
                    ? 'bg-white text-green-600 hover:shadow-lg'
                    : 'border-2 border-white text-white hover:bg-white hover:text-green-600'
                }`}
              >
                {btn.label}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
}