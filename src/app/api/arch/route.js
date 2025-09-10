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

    const query = {
      status: "accepted",
      ...(q
        ? {
            $or: [
              { title: new RegExp(q, "i") },
              { abstract: new RegExp(q, "i") },
              { keywords: new RegExp(q, "i") },
            ],
          }
        : {}),
    };

    const papers = await PaperModel.find(query)
      .select("title fileUrl createdAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json(
      papers.map((p) => ({
        id: String(p._id),
        title: p.title,
        fileUrl: p.fileUrl || "",
        createdAt: p.createdAt,
      }))
    );
  } catch (error) {
    console.error("Archives API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
