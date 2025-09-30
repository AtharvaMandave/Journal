import { NextResponse } from "next/server";
import mongooseModule from "../../../../../lib/mongoose";
import annModule from "../../../../../models/Announcement";

const { connect } = mongooseModule;
const { AnnouncementModel } = annModule;

export async function GET() {
  await connect();
  const items = await AnnouncementModel.find({ active: true }).sort({ createdAt: -1 }).limit(5).lean();
  const res = NextResponse.json(items.map((a) => ({ id: String(a._id), title: a.title, message: a.message, deadline: a.deadline, type: a.type })));
  res.headers.set("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=600");
  return res;
}


