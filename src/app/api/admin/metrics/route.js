import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";
import reviewModule from "../../../../../models/Review";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;
const { ReviewModel } = reviewModule;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connect();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [submissions, accepted, total, reviews] = await Promise.all([
    PaperModel.countDocuments({ createdAt: { $gte: since } }),
    PaperModel.countDocuments({ status: "accepted", createdAt: { $gte: since } }),
    PaperModel.countDocuments({}),
    ReviewModel.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$reviewerId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
  ]);

  // Lighten expensive aggregation; make it optional later if needed
  let byCountryAgg = [];

  const acceptanceRate = total ? (await PaperModel.countDocuments({ status: "accepted" })) / total : 0;
  const res = NextResponse.json({
    submissionsLast30: submissions,
    acceptedLast30: accepted,
    acceptanceRate,
    topReviewerActivity: reviews.map((r) => ({ reviewerId: String(r._id), count: r.count })),
    papersByCountry: byCountryAgg.filter((x) => x._id).map((x) => ({ country: x._id, count: x.count })),
  });
  // Cache admin metrics briefly (private caches only)
  res.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=60");
  return res;
}


