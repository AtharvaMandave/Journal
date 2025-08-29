"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-semibold tracking-tight text-black">
            Journal
          </Link>
        </div>
        <button
          aria-label="Toggle menu"
          className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border"
          onClick={() => setOpen((v) => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
        </button>
        <div className="hidden items-center gap-6 sm:flex">
          <NavLinks />
          <AuthButtons session={session} />
        </div>
      </nav>
      {open ? (
        <div className="sm:hidden border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 space-y-2">
            <NavLinks onClick={() => setOpen(false)} />
            <AuthButtons session={session} mobile onAction={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavLinks({ onClick }) {
  const linkClass = "text-sm text-gray-900 hover:text-black transition";
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
      <Link onClick={onClick} href="/current-issue" className={linkClass}>Current Issue</Link>
      <Link onClick={onClick} href="/archives" className={linkClass}>Archives</Link>
      <Link onClick={onClick} href="/submit" className={linkClass}>Submit</Link>
      <Link onClick={onClick} href="/check-status" className={linkClass}>Check Status</Link>
      <Link onClick={onClick} href="/certificates" className={linkClass}>Certificates</Link>
      <Link onClick={onClick} href="/editorial-board" className={linkClass}>Editorial Board</Link>
      <Link onClick={onClick} href="/about" className={linkClass}>About</Link>
      <Link onClick={onClick} href="/aims-scope" className={linkClass}>Aims & Scope</Link>
      <Link onClick={onClick} href="/peer-review" className={linkClass}>Peer Review</Link>
      <Link onClick={onClick} href="/ethics" className={linkClass}>Ethics</Link>
    </div>
  );
}

function AuthButtons({ session, mobile, onAction }) {
  if (session?.user) {
    return (
      <div className={mobile ? "flex flex-col gap-3" : "flex items-center gap-3"}>
        <Link onClick={onAction} href="/dashboard" className="inline-flex items-center rounded-md text-black border px-3 py-1.5 text-sm font-medium hover:bg-white">Dashboard</Link>
        {session.user.role === "editor" || session.user.role === "admin" ? (
          <Link onClick={onAction} href="/editor" className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">Editor</Link>
        ) : null}
        {session.user.role === "reviewer" ? (
          <Link onClick={onAction} href="/reviewer" className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">Reviewer</Link>
        ) : null}
        {session.user.role === "admin" ? (
          <Link onClick={onAction} href="/admin" className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">Admin</Link>
        ) : null}
        {session.user.role === "editor" || session.user.role === "admin" ? (
          <Link onClick={onAction} href="/admin/issues" className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">Issues</Link>
        ) : null}
        <button
          onClick={() => { signOut(); onAction && onAction(); }}
          className="inline-flex items-center rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/90"
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div className={mobile ? "flex flex-col gap-3" : "flex items-center gap-3"}>
      <Link onClick={onAction} href="/login" className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50">Login</Link>
      <Link onClick={onAction} href="/register" className="inline-flex items-center rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/90">Register</Link>
    </div>
  );
}


