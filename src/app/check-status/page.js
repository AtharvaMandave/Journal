"use client";

import { useState } from "react";
import { Card, CardBody, Input, Label, Button, Badge } from "../../components/ui";

export default function CheckStatusPage() {
  const [email, setEmail] = useState("");
  const [paperId, setPaperId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    const res = await fetch("/api/public/check-status", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, paperId }) });
    const j = await res.json();
    setLoading(false);
    if (!res.ok) { setError(j.error || "Not found"); return; }
    setResult(j);
  }

  return (
    <main className="p-8 sm:p-20">
      <h1 className="text-2xl font-semibold">Check Paper Status</h1>
      <Card className="mt-6 max-w-xl">
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="pid">Paper ID</Label>
              <Input id="pid" value={paperId} onChange={(e) => setPaperId(e.target.value)} required />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button disabled={loading} className="w-full">{loading ? "Checking..." : "Check"}</Button>
          </form>

          {result ? (
            <div className="mt-6 rounded-2xl border p-4">
              <p className="text-sm text-gray-600">Title</p>
              <p className="font-medium">{result.title}</p>
              <div className="mt-3 flex items-center gap-2">
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge status={result.status} />
              </div>
            </div>
          ) : null}
        </CardBody>
      </Card>
    </main>
  );
}

function StatusBadge({ status }) {
  const map = {
    submitted: "gray",
    "under-review": "blue",
    revise: "red",
    accepted: "green",
    published: "emerald",
  };
  return <Badge color={map[status] || "gray"}>{status}</Badge>;
}


