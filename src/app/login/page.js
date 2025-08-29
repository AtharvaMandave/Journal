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
      else if (role === "editor" || role === "admin") router.push("/editor");
      else router.push("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  }

  return (
    <main className="p-8 sm:p-20">
      <h1 className="text-2xl font-semibold">Login</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
          Sign in
        </button>
      </form>
    </main>
  );
}


