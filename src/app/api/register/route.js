import { NextResponse } from "next/server";
import mongooseModule from "../../../../lib/mongoose";
import userModule from "../../../../models/User";
import bcrypt from "bcryptjs";

const { connect } = mongooseModule;
const { UserModel, USER_ROLES } = userModule;

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, affiliation, role, code } = body || {};
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await connect();
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // Determine final role: allow editor/admin only with a secret code
    let finalRole = "author";
    if (["author", "reviewer"].includes(role)) {
      finalRole = role;
    } else if ((role === "editor" || role === "admin") && code && code === process.env.SIGNUP_ELEVATED_CODE) {
      finalRole = role;
    }

    const user = await UserModel.create({
      name,
      email,
      passwordHash,
      affiliation: affiliation || "",
      role: finalRole,
    });
    return NextResponse.json({ id: String(user._id), email: user.email });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


