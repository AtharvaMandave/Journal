import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "reviewer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connect();
  // Show papers where reviewer is assigned or invited (and accepted)
  const papers = await PaperModel.find({
    $or: [
      { assignedReviewers: session.user.id },
      { reviewerInvites: { $elemMatch: { reviewerId: session.user.id, status: { $in: ["invited", "accepted"] } } } },
    ],
  })
    .select("title status fileUrl createdAt reviewerInvites")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(
    papers.map((p) => ({
      id: String(p._id),
      title: p.title,
      status: p.status,
      fileUrl: p.fileUrl || "",
      inviteStatus: Array.isArray(p.reviewerInvites)
        ? (p.reviewerInvites.find((ri) => String(ri.reviewerId) === session.user.id)?.status || "")
        : "",
    }))
  );
}


