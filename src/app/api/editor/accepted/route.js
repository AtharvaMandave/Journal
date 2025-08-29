import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connect();
  const papers = await PaperModel.find({ status: "accepted" }).select("title fileUrl").sort({ createdAt: -1 }).lean();
  return NextResponse.json(papers.map((p) => ({ id: String(p._id), title: p.title, fileUrl: p.fileUrl || "" })));
}


