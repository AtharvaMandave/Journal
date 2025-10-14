import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "editor" && session.user.role !== "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  
  await connect();
  
  // Define which statuses each role can see
  let statusFilter;
  
  if (session.user.role === "editor") {
    // Editors see: submitted, under-review, and their own recommendations
    statusFilter = { 
      $in: ["submitted", "under-review", "pending-approval", "editor-rejected", "final-version-uploaded", "ready-for-publication", "accepted"] 
    };
  } else {
    // Admins see: all papers including those pending approval
    statusFilter = { 
      $in: ["submitted", "under-review", "pending-approval", "editor-rejected", "ready-for-publication"] 
    };
  }
  
  const baseQuery = { status: statusFilter };
  
  // Editors only see papers assigned to them
  const query = session.user.role === "editor"
    ? { ...baseQuery, editorId: session.user.id }
    : baseQuery;
  
  const papers = await PaperModel.find(query)
    .select("title status fileUrl createdAt assignedReviewers reviewerInvites screened screeningNotes editorId doi editorDecision editorDecisionAt")
    .sort({ createdAt: -1 })
    .lean();
    
  return NextResponse.json(
    papers.map((p) => ({
      id: String(p._id),
      title: p.title,
      status: p.status,
      fileUrl: p.fileUrl || "",
      doi: p.doi || "",
      screened: !!p.screened,
      screeningNotes: p.screeningNotes || "",
      editorId: p.editorId ? String(p.editorId) : "",
      editorDecision: p.editorDecision || "",
      editorDecisionAt: p.editorDecisionAt || null,
      assignedReviewers: Array.isArray(p.assignedReviewers) 
        ? p.assignedReviewers.map((r) => String(r)) 
        : [],
      reviewerInvites: Array.isArray(p.reviewerInvites)
        ? p.reviewerInvites.map((ri) => ({ 
            reviewerId: String(ri.reviewerId), 
            status: ri.status, 
            invitedAt: ri.invitedAt || null, 
            respondedAt: ri.respondedAt || null 
          }))
        : [],
    }))
  );
}