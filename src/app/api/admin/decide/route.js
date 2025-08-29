import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel, PAPER_STATUSES } = paperModule;

const ALLOWED = new Set(["accepted", "rejected", "revise", "published"]);

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { paperId, decision } = await request.json();
  if (!paperId || !ALLOWED.has(decision)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await connect();
  const updated = await PaperModel.findByIdAndUpdate(paperId, { status: decision }, { new: true });
  if (!updated) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  return NextResponse.json({ ok: true, status: updated.status });
}


