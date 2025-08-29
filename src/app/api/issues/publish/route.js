import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import issueModule from "../../../../../models/Issue";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { IssueModel } = issueModule;
const { PaperModel } = paperModule;

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
  await PaperModel.updateMany({ _id: { $in: paperIds } }, { status: "published", issueId: issue._id });
  issue.publishedAt = new Date();
  await issue.save();
  return NextResponse.json({ ok: true, publishedAt: issue.publishedAt });
}


