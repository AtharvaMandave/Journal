"use client";

import { useRouter } from "next/navigation";
import { useState, use } from "react";
import axios from "axios";

export default function ReviewFormPage({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [form, setForm] = useState({
    rating: 3,
    recommendation: "minor-revision",
    comments: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle field updates dynamically
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the review
  const submitReview = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await axios.post("/api/reviews", {
        paperId: id,
        rating: Number(form.rating),
        comments: form.comments,
        recommendation: form.recommendation,
      });

      router.push("/reviewer");
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data?.error || "Failed to submit review");
      } else {
        setMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 sm:p-20 bg-gray-50 min-h-screen text-gray-900">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Submit Review
        </h1>

        <form onSubmit={submitReview} className="space-y-5 bg-white p-6 rounded-xl shadow-sm border">
          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Rating (1–5)
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              min={1}
              max={5}
              value={form.rating}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Recommendation */}
          <div>
            <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700">
              Recommendation
            </label>
            <select
              id="recommendation"
              name="recommendation"
              value={form.recommendation}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="accept">Accept</option>
              <option value="minor-revision">Minor Revision</option>
              <option value="major-revision">Major Revision</option>
              <option value="reject">Reject</option>
            </select>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <textarea
              id="comments"
              name="comments"
              rows={6}
              value={form.comments}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Write your review comments..."
            />
          </div>

          {/* Error or Status Message */}
          {message && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {message}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2 font-medium text-white transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </main>
  );
}
