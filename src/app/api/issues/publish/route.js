import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import issueModule from "../../../../../models/Issue";
import paperModule from "../../../../../models/Paper";
import { sendMail } from "../../../../../lib/email";
import userModule from "../../../../../models/User";

const { connect } = mongooseModule;
const { IssueModel } = issueModule;
const { PaperModel } = paperModule;
const { UserModel } = userModule;

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { issueId } = await request.json();
  if (!issueId) return NextResponse.json({ error: "Missing issueId" }, { status: 400 });
  await connect();
  const issue = await IssueModel.findById(issueId);
  if (!issue) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const paperIds = issue.papers || [];
  // Set DOI for papers that don't have one yet and mark published
  const papersToUpdate = await PaperModel.find({ _id: { $in: paperIds } }).select("_id doi");
  for (const p of papersToUpdate) {
    if (!p.doi) {
      // Simple DOI generator; replace with your prefix/allocator
      const prefix = process.env.DOI_PREFIX || "10.1234";
      const doi = `${prefix}/ts-${p._id.toString()}`;
      await PaperModel.findByIdAndUpdate(p._id, { doi });
    }
  }
  await PaperModel.updateMany({ _id: { $in: paperIds } }, { status: "published", issueId: issue._id });
  issue.publishedAt = new Date();
  await issue.save();
  // Notify corresponding authors (best-effort)
  try {
    const papers = await PaperModel.find({ _id: { $in: paperIds } }).select("title correspondingAuthor");
    const authors = await UserModel.find({ _id: { $in: papers.map((p) => p.correspondingAuthor) } }).select("_id email name");
    const idToAuthor = new Map(authors.map((a) => [String(a._id), a]));
    await Promise.all(
      papers.map((p) => {
        const a = idToAuthor.get(String(p.correspondingAuthor));
        if (!a?.email) return Promise.resolve();
        return sendMail({
          to: a.email,
          subject: `Your paper is now published: ${p.title}`,
          html: `<p>Dear ${a.name || "Author"},</p><p>Your paper "${p.title}" has been published in Volume ${issue.volume}, Issue ${issue.issueNumber} (${issue.year}).</p>`,
        }).catch(() => {});
      })
    );
  } catch {}
  return NextResponse.json({ ok: true, publishedAt: issue.publishedAt });
}


