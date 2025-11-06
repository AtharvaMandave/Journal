import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";
import Navbar from "../components/Navbar";
import { Card } from "../components/ui";
import { Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TechnoScholars | An Open Access Journal",
  description: "A modern open-access academic journal committed to advancing research and knowledge sharing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        <Providers>
          <Navbar />
          <div className="min-h-[calc(100vh-200px)] bg-gray-50/60">
            {children}
          </div>
         <footer className="border-t bg-gray-50 text-gray-900">
  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="grid gap-8 md:grid-cols-4">
      {/* About Section */}
      <div className="md:col-span-1">
        <h3 className="text-lg font-bold text-gray-900">Journal</h3>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">
          A modern open-access academic journal committed to advancing research and knowledge sharing.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h4>
        <ul className="mt-4 space-y-3">
          <li><Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About Us</Link></li>
          <li><Link href="/editorial-board" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Editorial Board</Link></li>
          <li><Link href="/submit" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Submit Article</Link></li>
          <li><Link href="/archives" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Archives</Link></li>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h4>
        <ul className="mt-4 space-y-3">
          <li><Link href="/author-guidelines" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Author Guidelines</Link></li>
          <li><Link href="/peer-review" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Peer Review Process</Link></li>
          <li><Link href="/open-access" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Open Access Policy</Link></li>
          <li><Link href="/faqs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">FAQ</Link></li>
        </ul>
      </div>

      {/* Contact & Social */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Connect</h4>
        <ul className="mt-4 space-y-3">
          <li className="text-sm text-gray-600">
            <a href="mailto:editor@technoscholars.com" className="hover:text-gray-900 transition-colors">
              editor@technoscholars.com
            </a>
          </li>
          <li className="text-sm text-gray-600">ISSN: 2582-5208</li>
        </ul>
        <div className="mt-4 flex items-center gap-4">
          <a href="#" aria-label="Twitter" className="text-gray-600 hover:text-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" aria-label="LinkedIn" className="text-gray-600 hover:text-gray-900 transition-colors" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>

    {/* Bottom Bar */}
    <div className="mt-10 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-xs text-gray-500 text-center md:text-left">
        © {new Date().getFullYear()} TechnoScholars. All rights reserved.
      </p>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
        <Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">Terms of Use</Link>
        <Link href="/accessibility" className="text-gray-500 hover:text-gray-900 transition-colors">Accessibility</Link>
        <Link href="/sitemap" className="text-gray-500 hover:text-gray-900 transition-colors">Sitemap</Link>
      </div>
    </div>
  </div>
</footer>
        </Providers>
      </body>
    </html>
  );
}