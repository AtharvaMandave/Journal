import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { paperId, screened, notes } = await request.json();
  if (!paperId || typeof screened !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await connect();
  const update = { screened, screeningNotes: notes || "" };
  const updated = await PaperModel.findByIdAndUpdate(paperId, update, { new: true });
  if (!updated) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  return NextResponse.json({ ok: true, screened: updated.screened });
}



