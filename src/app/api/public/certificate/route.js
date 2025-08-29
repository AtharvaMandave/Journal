import { NextResponse } from "next/server";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";
import userModule from "../../../../../models/User";
import issueModule from "../../../../../models/Issue";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;
const { UserModel } = userModule;
const { IssueModel } = issueModule;

export async function POST(request) {
  const { email, paperId } = await request.json();
  if (!email || !paperId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await connect();
  const user = await UserModel.findOne({ email }).select("_id name email affiliation");
  if (!user) return NextResponse.json({ error: "No matching author" }, { status: 404 });
  const paper = await PaperModel.findOne({ _id: paperId, correspondingAuthor: user._id }).lean();
  if (!paper) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!(paper.status === "accepted" || paper.status === "published")) {
    return NextResponse.json({ error: "Certificate available after acceptance" }, { status: 400 });
  }
  let issue = null;
  if (paper.issueId) {
    const i = await IssueModel.findById(paper.issueId).lean();
    if (i) issue = { volume: i.volume, issueNumber: i.issueNumber, year: i.year, publishedAt: i.publishedAt || null };
  }
  return NextResponse.json({
    paper: {
      id: String(paper._id),
      title: paper.title,
      status: paper.status,
      fileUrl: paper.fileUrl || "",
      createdAt: paper.createdAt,
      updatedAt: paper.updatedAt,
    },
    author: { name: user.name, email: user.email, affiliation: user.affiliation || "" },
    issue,
  });
}


