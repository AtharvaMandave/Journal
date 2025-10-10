import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { paperId, decision } = await request.json();

  if (!paperId || !decision) {
    return NextResponse.json({ error: "Missing paperId or decision" }, { status: 400 });
  }

  await connect();

  const paper = await PaperModel.findById(paperId);
  if (!paper) {
    return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  }

  // EDITOR workflow: Can only recommend, not finalize
  if (session.user.role === "editor") {
    // Editors can only work on papers assigned to them
    if (paper.editorId?.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not assigned to you" }, { status: 403 });
    }

    // Map editor decisions to statuses that require admin approval
    const editorDecisionMap = {
      "accepted": "pending-approval",  // Needs admin approval
      "rejected": "editor-rejected",   // Needs admin review
      "revise": "revise"               // Direct revision request
    };

    const newStatus = editorDecisionMap[decision];
    if (!newStatus) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    paper.status = newStatus;
    paper.editorDecision = decision;
    paper.editorDecisionAt = new Date();
    await paper.save();

    return NextResponse.json({ 
      message: "Editor recommendation recorded",
      status: newStatus,
      requiresAdminApproval: newStatus === "pending-approval"
    });
  }

  // ADMIN workflow: Can finalize all decisions
  if (session.user.role === "admin") {
    const adminDecisionMap = {
      "accepted": "accepted",
      "rejected": "rejected",
      "revise": "revise"
    };

    const newStatus = adminDecisionMap[decision];
    if (!newStatus) {
      return NextResponse.json({ error: "Invalid decision" }, { status: 400 });
    }

    paper.status = newStatus;
    paper.finalDecision = decision;
    paper.finalDecisionAt = new Date();
    paper.finalDecisionBy = session.user.id;
    
    // If accepted, set publication date
    if (decision === "accepted") {
      paper.publishedAt = new Date();
    }

    await paper.save();

    return NextResponse.json({ 
      message: "Final decision recorded",
      status: newStatus
    });
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}