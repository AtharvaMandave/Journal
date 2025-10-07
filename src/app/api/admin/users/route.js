import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import userModule from "../../../../../models/User";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { UserModel, USER_ROLES } = userModule;
const { PaperModel } = paperModule;

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

// Assign editor to a paper (admin only)
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { paperId, editorId } = await request.json();
  if (!paperId || !editorId) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  await connect();
  const editor = await UserModel.findById(editorId);
  if (!editor || editor.role !== "editor") {
    return NextResponse.json({ error: "Invalid editor" }, { status: 400 });
  }
  const updated = await PaperModel.findByIdAndUpdate(paperId, { editorId: editor._id }, { new: true });
  if (!updated) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}


