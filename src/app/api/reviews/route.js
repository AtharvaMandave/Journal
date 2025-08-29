import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongooseModule from "../../../../lib/mongoose";
import reviewModule from "../../../../models/Review";
import paperModule from "../../../../models/Paper";

const { connect } = mongooseModule;
const { ReviewModel } = reviewModule;
const { PaperModel } = paperModule;

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "reviewer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { paperId, rating, comments, recommendation } = await request.json();
  if (!paperId || !rating || !recommendation) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await connect();
  const paper = await PaperModel.findById(paperId);
  if (!paper) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  if (!paper.assignedReviewers?.some((r) => String(r) === session.user.id)) {
    return NextResponse.json({ error: "Not assigned" }, { status: 403 });
  }
  const review = await ReviewModel.create({
    paperId,
    reviewerId: session.user.id,
    rating,
    comments: comments || "",
    recommendation,
  });
  await PaperModel.findByIdAndUpdate(paperId, { $addToSet: { reviews: review._id } });

  // Optional auto-update: if all assigned reviewers submitted, notify or update status
  const updated = await PaperModel.findById(paperId).lean();
  const allIn = (updated.assignedReviewers?.length || 0) > 0 && (updated.reviews?.length || 0) >= updated.assignedReviewers.length;
  if (allIn) {
    await PaperModel.findByIdAndUpdate(paperId, { status: "revise" });
  }

  return NextResponse.json({ id: String(review._id) }, { status: 201 });
}

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const reviewerId = searchParams.get("reviewerId");
  const paperId = searchParams.get("paperId");
  await connect();
  if (reviewerId) {
    if (session.user.role !== "reviewer" || session.user.id !== reviewerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const reviews = await ReviewModel.find({ reviewerId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(reviews.map((r) => ({ id: String(r._id), paperId: String(r.paperId), rating: r.rating, recommendation: r.recommendation, createdAt: r.createdAt })));
  }
  if (paperId) {
    if (session.user.role !== "editor" && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const reviews = await ReviewModel.find({ paperId }).sort({ createdAt: 1 }).lean();
    return NextResponse.json(reviews.map((r) => ({ id: String(r._id), reviewerId: String(r.reviewerId), rating: r.rating, comments: r.comments, recommendation: r.recommendation })));
  }
  return NextResponse.json({ error: "Missing query" }, { status: 400 });
}


