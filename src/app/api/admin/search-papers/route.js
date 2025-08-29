import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  await connect();
  const query = q
    ? { $or: [{ title: new RegExp(q, "i") }, { abstract: new RegExp(q, "i") }, { keywords: new RegExp(q, "i") }] }
    : {};
  const papers = await PaperModel.find(query).select("title status fileUrl createdAt").limit(50).sort({ createdAt: -1 }).lean();
  return NextResponse.json(papers.map((p) => ({ id: String(p._id), title: p.title, status: p.status, fileUrl: p.fileUrl || "", createdAt: p.createdAt })));
}


