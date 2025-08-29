import { NextResponse } from "next/server";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";
import userModule from "../../../../../models/User";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;
const { UserModel } = userModule;

export async function POST(request) {
  const { email, paperId } = await request.json();
  if (!email || !paperId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  await connect();
  const user = await UserModel.findOne({ email }).select("_id");
  if (!user) return NextResponse.json({ error: "No matching author" }, { status: 404 });
  const paper = await PaperModel.findOne({ _id: paperId, correspondingAuthor: user._id }).select("title status createdAt updatedAt issueId").lean();
  if (!paper) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    id: String(paperId),
    title: paper.title,
    status: paper.status,
    createdAt: paper.createdAt,
    updatedAt: paper.updatedAt,
    issueId: paper.issueId ? String(paper.issueId) : null,
  });
}


