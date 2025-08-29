import { connect } from "../../../../lib/mongoose";
import { PaperModel } from "../../../../models/Paper";

export const dynamic = "force-dynamic";

export default async function PaperDetailPage({ params }) {
  await connect();
  const paper = await PaperModel.findById(params.id).lean();
  if (!paper || !["accepted", "published"].includes(paper.status)) {
    return (
      <main className="p-8 sm:p-20">
        <h1 className="text-2xl font-semibold">Paper not available</h1>
        <p className="mt-4 text-gray-600">This paper is not published or does not exist.</p>
      </main>
    );
  }

  const authors = Array.isArray(paper.authors) ? paper.authors : [];

  return (
    <main className="p-8 sm:p-20">
      <h1 className="text-2xl font-semibold">{paper.title}</h1>
      <div className="mt-3 text-sm text-gray-700">
        {authors.length > 0 ? (
          <p>Authors: {authors.map((a) => a.name).join(", ")}</p>
        ) : null}
        <p className="mt-1">Status: {paper.status}</p>
      </div>
      <article className="prose mt-6 max-w-none">
        <h2 className="text-xl font-medium">Abstract</h2>
        <p className="mt-2 whitespace-pre-line text-gray-800">{paper.abstract}</p>
      </article>
      <div className="mt-6 flex items-center gap-3">
        {paper.fileUrl ? (
          <a href={paper.fileUrl} className="inline-flex items-center rounded-2xl border px-4 py-2 text-sm" target="_blank" rel="noreferrer">Download PDF</a>
        ) : null}
      </div>
    </main>
  );
}


