import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import userModule from "../../../../../models/User";

const { connect } = mongooseModule;
const { UserModel } = userModule;

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "admin" && session.user.role !== "editor")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  await connect();
  const reviewers = await UserModel.find({
    role: "reviewer",
    ...(q ? { $or: [ { name: new RegExp(q, "i") }, { email: new RegExp(q, "i") } ] } : {}),
  })
    .limit(20)
    .lean();
  return NextResponse.json(reviewers.map((u) => ({ id: String(u._id), name: u.name, email: u.email })));
}


