import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongooseModule from "../../../../lib/mongoose";
import issueModule from "../../../../models/Issue";

const { connect } = mongooseModule;
const { IssueModel } = issueModule;

export async function GET() {
  await connect();
  const issues = await IssueModel.find().sort({ year: -1, volume: -1, issueNumber: -1 }).lean();
  return NextResponse.json(issues.map((i) => ({ id: String(i._id), volume: i.volume, issueNumber: i.issueNumber, year: i.year, publishedAt: i.publishedAt || null, coverImageUrl: i.coverImageUrl || "" })));
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { volume, issueNumber, year, coverImageUrl } = await request.json();
  if (!volume || !issueNumber || !year) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await connect();
  const created = await IssueModel.create({ volume, issueNumber, year, coverImageUrl: coverImageUrl || "" });
  return NextResponse.json({ id: String(created._id) }, { status: 201 });
}


