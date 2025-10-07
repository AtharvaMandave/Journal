import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";
import userModule from "../../../../../models/User";
import { sendMail } from "../../../../../lib/email";

const { connect } = mongooseModule;
const { PaperModel, PAPER_STATUSES } = paperModule;
const { UserModel } = userModule;

const ALLOWED = new Set(["accepted", "rejected", "revise", "published"]);

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { paperId, decision } = await request.json();
  if (!paperId || !ALLOWED.has(decision)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await connect();
  const updated = await PaperModel.findByIdAndUpdate(paperId, { status: decision }, { new: true });
  if (!updated) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  // Notify corresponding author (best-effort)
  try {
    const author = await UserModel.findById(updated.correspondingAuthor).select("email name");
    if (author?.email) {
      const subject = `Decision on your submission: ${updated.title}`;
      let body =
        decision === "accepted"
          ? "Your paper has been accepted."
          : decision === "revise"
          ? "Please revise your paper and resubmit."
          : decision === "rejected"
          ? "We regret to inform you your paper was not accepted."
          : `Status updated: ${decision}`;
      // Attach reviews (author-visible comments only)
      const { ReviewModel } = require("../../../../../models/Review");
      const reviews = await ReviewModel.find({ paperId: updated._id }).sort({ createdAt: 1 }).lean();
      if (reviews.length) {
        const comments = reviews
          .map((r, i) => `<p><strong>Review ${i + 1}</strong>: ${r.comments || "(no comments)"}</p>\n<p>Recommendation: ${r.recommendation}</p>`)
          .join("\n");
        body += `\n\n<p><strong>Reviews:</strong></p>${comments}`;
      }
      await sendMail({ to: author.email, subject, html: `<p>Dear ${author.name || "Author"},</p><p>${body}</p>` }).catch(() => {});
    }
  } catch {}
  return NextResponse.json({ ok: true, status: updated.status });
}


