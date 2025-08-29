import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import issueModule from "../../../../../models/Issue";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { IssueModel } = issueModule;
const { PaperModel } = paperModule;

export async function GET(_req, { params }) {
  await connect();
  const issue = await IssueModel.findById(params.id).lean();
  if (!issue) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const papers = await PaperModel.find({ _id: { $in: issue.papers || [] } }).select("title fileUrl status").lean();
  return NextResponse.json({
    id: String(issue._id),
    volume: issue.volume,
    issueNumber: issue.issueNumber,
    year: issue.year,
    publishedAt: issue.publishedAt || null,
    coverImageUrl: issue.coverImageUrl || "",
    papers: papers.map((p) => ({ id: String(p._id), title: p.title, status: p.status, fileUrl: p.fileUrl || "" })),
  });
}

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { coverImageUrl, papers } = await request.json();
  await connect();
  const updated = await IssueModel.findByIdAndUpdate(
    params.id,
    { ...(coverImageUrl ? { coverImageUrl } : {}), ...(Array.isArray(papers) ? { papers } : {}) },
    { new: true }
  );
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}


