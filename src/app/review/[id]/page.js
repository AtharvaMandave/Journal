"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ReviewFormPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [rating, setRating] = useState(3);
  const [recommendation, setRecommendation] = useState("minor-revision");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState("");

  async function submitReview(e) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ paperId: id, rating, comments, recommendation }) });
    const j = await res.json();
    if (!res.ok) {
      setMessage(j.error || "Failed to submit review");
      return;
    }
    router.push("/reviewer");
  }

  return (
    <main className="p-8 sm:p-20">
      <h1 className="text-2xl font-semibold text-black">Submit Review</h1>
      <form onSubmit={submitReview} className="mt-6 max-w-xl space-y-4 text-black">
        <label className="block text-sm text-black">Rating (1-5)</label>
        <input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className="w-full rounded border px-3 py-2" />
        <label className="block text-sm">Recommendation</label>
        <select value={recommendation} onChange={(e) => setRecommendation(e.target.value)} className="w-full rounded border px-3 py-2">
          <option value="accept">Accept</option>
          <option value="minor-revision">Minor revision</option>
          <option value="major-revision">Major revision</option>
          <option value="reject">Reject</option>
        </select>
        <label className="block text-sm">Comments</label>
        <textarea rows={6} value={comments} onChange={(e) => setComments(e.target.value)} className="w-full rounded border px-3 py-2" />
        {message ? <p className="text-sm text-red-600">{message}</p> : null}
        <button className="rounded bg-black px-4 py-2 text-white">Submit Review</button>
      </form>
    </main>
  );
}


