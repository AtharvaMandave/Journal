import { NextResponse } from "next/server";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function GET() {
  await connect();
  const papers = await PaperModel.find({ status: "published" }).select("title fileUrl createdAt").sort({ createdAt: -1 }).limit(12).lean();
  const res = NextResponse.json(papers.map((p) => ({ id: String(p._id), title: p.title, fileUrl: p.fileUrl || "", createdAt: p.createdAt })));
  res.headers.set("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
  return res;
}


