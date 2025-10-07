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
    <main className="p-8 sm:p-20 bg-black">
      <h1 className="text-2xl font-semibold">Register</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
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
        <input
          type="text"
          placeholder="Affiliation"
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <div>
          <label className="text-sm font-medium">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 w-full border rounded px-3 py-2">
            <option value="author">Author</option>
            <option value="reviewer">Reviewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {(role === "editor" || role === "admin") ? (
          <input
            type="password"
            placeholder={`${role.charAt(0).toUpperCase() + role.slice(1)} signup code`}
            value={elevatedCode}
            onChange={(e) => setElevatedCode(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        ) : null}
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <button type="submit" className="px-4 py-2 bg-black text-white rounded">
          Create account
        </button>
      </form>
    </main>
  );
}


