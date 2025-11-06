// File: src/app/api/auth/signout-custom/route.js
// Only use this if you need CUSTOM logic (audit logs, external APIs, etc.)
// Otherwise, just use signOut() from next-auth/react directly

import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No active session" },
        { status: 401 }
      );
    }

    // Add your custom logic here
    // Example: Log audit trail, notify external services, etc.
    // await logAuditTrail(session.user.id, "logout");
    // await notifyExternalService(session.user.id);

    return NextResponse.json({ 
      success: true,
      message: "Signed out successfully" 
    });
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}