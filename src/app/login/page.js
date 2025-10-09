"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      // Fetch session to know role and redirect accordingly
      const roleRes = await fetch("/api/auth/session");
      const sess = await roleRes.json();
      const role = sess?.user?.role;
      if (role === "reviewer") router.push("/reviewer");
      else if (role === "editor") router.push("/editor");
      else if(role === "admin")router.push("/admin");
      else router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="mx-auto grid max-w-5xl items-center gap-8 sm:grid-cols-2">
        <div className="hidden sm:block">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">Sign in to manage submissions, reviews, and editorial actions.</p>
        </div>
        <div className="sm:justify-self-end">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Sign in</h2>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  required
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input id="remember" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor="remember" className="text-gray-600">Remember me</label>
                </div>
                <a className="text-gray-700 underline underline-offset-4" href="#">Forgot password?</a>
              </div>
              <button type="submit" className="w-full rounded-lg bg-black px-4 py-2 text-white transition hover:bg-gray-800">
                Sign in
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              New to the journal? <a href="/register" className="text-gray-900 underline underline-offset-4">Create an account</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


