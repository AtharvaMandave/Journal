"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [role, setRole] = useState("author");
  const [elevatedCode, setElevatedCode] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, affiliation, role, code: elevatedCode || undefined }),
    });
    if (res.ok) {
      if (role === "reviewer") router.push("/reviewer");
      else router.push("/dashboard");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Registration failed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="mx-auto grid max-w-5xl items-center gap-8 sm:grid-cols-2">
        <div className="hidden sm:block">
          <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-600">Join as an author, reviewer, or editor to participate in the journal workflow.</p>
        </div>
        <div className="sm:justify-self-end">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Register</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-sm text-gray-700">Name</label>
                <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" required />
              </div>
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" required />
              </div>
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" required />
              </div>
              <div>
                <label className="text-sm text-gray-700">Affiliation</label>
                <input type="text" placeholder="University / Company (optional)" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" />
              </div>
              <div>
                <label className="text-sm text-gray-700">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                  <option value="author">Author</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {(role === "editor" || role === "admin") ? (
                <div>
                  <label className="text-sm text-gray-700">{`${role.charAt(0).toUpperCase() + role.slice(1)} signup code`}</label>
                  <input type="password" placeholder="Enter access code" value={elevatedCode} onChange={(e) => setElevatedCode(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10" required />
                </div>
              ) : null}
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <button type="submit" className="w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800">Create account</button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account? <a href="/login" className="text-gray-900 underline underline-offset-4">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


