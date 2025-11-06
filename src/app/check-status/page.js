"use client";
import { useState } from "react";
import axios from "axios";
import { Card, CardBody, Input, Label, Button, Badge } from "../../components/ui";

export default function CheckStatusPage() {
  const [form, setForm] = useState({ email: "", paperId: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const { data } = await axios.post("/api/public/check-status", form);
      setResult(data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || "Server error");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-16">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 text-center mb-6">
          Check Paper Status
        </h1>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <FormField
                id="paperId"
                label="Paper ID"
                value={form.paperId}
                onChange={handleChange}
                required
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button disabled={loading} className="w-full">
                {loading ? "Checking..." : "Check Status"}
              </Button>
            </form>

            {result && <ResultCard result={result} />}
          </CardBody>
        </Card>
      </div>
    </main>
  );
}

function FormField({ id, label, type = "text", value, onChange, required }) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

function ResultCard({ result }) {
  return (
    <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-600">Title</p>
          <p className="font-medium text-gray-900">{result.title}</p>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">Status:</p>
          <StatusBadge status={result.status} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    submitted: "gray",
    "under-review": "blue",
    revise: "yellow",
    accepted: "green",
    rejected: "red",
    published: "emerald",
  };

  const color = colors[status] || "gray";
  const formatted = status.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return <Badge color={color}>{formatted}</Badge>;
}
