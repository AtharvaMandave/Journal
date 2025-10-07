import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "reviewer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { paperId, response } = await request.json();
  if (!paperId || !["accept", "decline"].includes(response)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await connect();
  const paper = await PaperModel.findById(paperId);
  if (!paper) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  const idx = (paper.reviewerInvites || []).findIndex((i) => String(i.reviewerId) === session.user.id);
  if (idx === -1) return NextResponse.json({ error: "No invitation" }, { status: 404 });
  paper.reviewerInvites[idx].status = response === "accept" ? "accepted" : "declined";
  paper.reviewerInvites[idx].respondedAt = new Date();
  await paper.save();
  return NextResponse.json({ ok: true, status: paper.reviewerInvites[idx].status });
}



