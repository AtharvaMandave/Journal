import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";
import userModule from "../../../../../models/User";
import { sendMail } from "../../../../../lib/email";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;
const { UserModel } = userModule;

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { paperId, reviewerIds } = await request.json();
  if (!paperId || !Array.isArray(reviewerIds)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await connect();
  const updated = await PaperModel.findByIdAndUpdate(
    paperId,
    {
      $addToSet: {
        assignedReviewers: { $each: reviewerIds },
      },
      $push: {
        reviewerInvites: { $each: reviewerIds.map((id) => ({ reviewerId: id, status: "invited", invitedAt: new Date() })) },
      },
      status: "under-review",
    },
    { new: true }
  );
  if (!updated) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  // Email reviewers (best-effort)
  try {
    const reviewers = await UserModel.find({ _id: { $in: reviewerIds } }).select("email name");
    const subject = `Review request: ${updated.title}`;
    await Promise.all(
      reviewers
        .filter((r) => r.email)
        .map((r) =>
          sendMail({
            to: r.email,
            subject,
            html: `<p>Dear ${r.name || "Reviewer"},</p><p>You have been assigned to review the paper "${updated.title}".</p>`,
          }).catch(() => {})
        )
    );
  } catch {}
  return NextResponse.json({ ok: true });
}


