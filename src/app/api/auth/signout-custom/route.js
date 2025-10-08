// File: src/app/api/auth/signout-custom/route.js
// Create this file in your project at the path shown above

import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth]/route"; // Correct path for your structure
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, message: "No active session" },
        { status: 401 }
      );
    }

    // Clear session - this depends on your session strategy
    // For JWT strategy, the session will be cleared on the client side
    // For database strategy, you might need to delete the session from DB
    
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