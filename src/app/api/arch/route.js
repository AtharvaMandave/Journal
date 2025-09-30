import { NextResponse } from "next/server";
import mongooseModule from "../../../../lib/mongoose";
import paperModule from "../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    await connect();

    // Use text search when a query is provided (requires text index)
    const findFilter = q
      ? { $text: { $search: q }, status: "accepted" }
      : { status: "accepted" };

    const projection = q ? { score: { $meta: "textScore" }, title: 1, fileUrl: 1, createdAt: 1 } : { title: 1, fileUrl: 1, createdAt: 1 };

    const sortSpec = q ? { score: { $meta: "textScore" }, createdAt: -1 } : { createdAt: -1 };

    const papers = await PaperModel.find(findFilter, projection)
      .sort(sortSpec)
      .select("title fileUrl createdAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const res = NextResponse.json(
      papers.map((p) => ({
        id: String(p._id),
        title: p.title,
        fileUrl: p.fileUrl || "",
        createdAt: p.createdAt,
      }))
    );

    // Cache archives for 60s (public cache OK)
    res.headers.set("Cache-Control", "public, max-age=60, s-maxage=60, stale-while-revalidate=300");
    return res;
  } catch (error) {
    console.error("Archives API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
