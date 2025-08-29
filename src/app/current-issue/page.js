import { connect } from "../../../lib/mongoose";
import { IssueModel } from "../../../models/Issue";
import { PaperModel } from "../../../models/Paper";
import Image from "next/image";

export const dynamic = "force-static";

export default async function CurrentIssuePage() {
  await connect();
  const latest = await IssueModel.findOne({ publishedAt: { $ne: null } })
    .sort({ publishedAt: -1 })
    .lean();
  let papers = [];
  if (latest) {
    const list = await PaperModel.find({ issueId: latest._id, status: "published" }).select("title fileUrl").lean();
    papers = list.map((p) => ({ id: String(p._id), title: p.title, fileUrl: p.fileUrl || "" }));
  }
  return (
    <main className="p-8 sm:p-20">
      <h1 className="text-2xl font-semibold">Current Issue</h1>
      {latest ? (
        <div className="mt-4">
          <p className="text-gray-700">Vol. {latest.volume}, Issue {latest.issueNumber} ({latest.year})</p>
          {latest.coverImageUrl ? (
            <div className="mt-4 h-48 w-48 overflow-hidden rounded">
              <Image
                alt="Cover"
                src={latest.coverImageUrl}
                width={192}
                height={192}
                className="h-48 w-48 object-cover"
                unoptimized
                priority
              />
            </div>
          ) : null}
          <div className="mt-6 grid gap-3">
            {papers.length > 0 ? (
              papers.map((p) => (
                <div key={p.id} className="rounded border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{p.title}</p>
                    {p.fileUrl ? <a href={p.fileUrl} className="text-sm underline" target="_blank" rel="noreferrer">PDF</a> : null}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">No published papers yet.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No published issues yet.</p>
      )}
    </main>
  );
}


