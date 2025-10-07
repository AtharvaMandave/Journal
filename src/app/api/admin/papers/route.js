import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

// Admin-only: set DOI for a paper
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { paperId, doi } = await request.json();
  if (!paperId || typeof doi !== "string" || doi.trim().length < 3) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await connect();
  const updated = await PaperModel.findByIdAndUpdate(paperId, { doi: doi.trim() }, { new: true });
  if (!updated) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  return NextResponse.json({ ok: true, doi: updated.doi || "" });
}


