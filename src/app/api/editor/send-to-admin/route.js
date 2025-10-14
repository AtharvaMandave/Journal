import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'editor') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paperId } = await request.json();

    if (!paperId) {
        return NextResponse.json({ error: "Missing paperId" }, { status: 400 });
    }

    await connect();

    const paper = await PaperModel.findById(paperId);
    if (!paper) {
        return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    if (paper.editorId?.toString() !== session.user.id) {
        return NextResponse.json({ error: "Not assigned to you" }, { status: 403 });
    }

    if (paper.status !== "final-version-uploaded") {
        return NextResponse.json({ error: "Final version not uploaded yet" }, { status: 400 });
    }

    if (paper.editorVersionUrl) {
        paper.fileUrl = paper.editorVersionUrl;
        paper.editorVersionUrl = null;
    }

    paper.status = "ready-for-publication";
    await paper.save();

    return NextResponse.json({ message: "Paper sent to admin for publication" });
}