import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import userModule from "../../../../../models/User";

const { connect } = mongooseModule;
const { UserModel, USER_ROLES } = userModule;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await connect();
  const users = await UserModel.find().select("name email role affiliation active createdAt").sort({ createdAt: -1 }).lean();
  return NextResponse.json(users.map((u) => ({ id: String(u._id), name: u.name, email: u.email, role: u.role, affiliation: u.affiliation || "", active: !!u.active, createdAt: u.createdAt })));
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { userId, role, active } = await request.json();
  if (!userId) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const update = {};
  if (role) {
    if (!USER_ROLES.includes(role)) return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    update.role = role;
  }
  if (typeof active === "boolean") update.active = active;
  await connect();
  await UserModel.findByIdAndUpdate(userId, update);
  return NextResponse.json({ ok: true });
}


