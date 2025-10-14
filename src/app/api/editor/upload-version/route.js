import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import mongooseModule from "../../../../../lib/mongoose";
import paperModule from "../../../../../models/Paper";
import { getSupabaseClient } from "../../../../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;

async function uploadToSupabase(file, key) {
    const supabase = getSupabaseClient();
        const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'jornal';

    const buffer = Buffer.from(await file.arrayBuffer());

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(key, buffer, {
            contentType: file.type,
        });

    if (error) {
        throw new Error(`Supabase upload error: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(key);

    return publicUrl;
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'editor') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const paperId = formData.get('paperId');
    const file = formData.get('file');

    if (!paperId || !file) {
        return NextResponse.json({ error: "Missing paperId or file" }, { status: 400 });
    }

    await connect();

    const paper = await PaperModel.findById(paperId);
    if (!paper) {
        return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    if (paper.editorId?.toString() !== session.user.id) {
        return NextResponse.json({ error: "Not assigned to you" }, { status: 403 });
    }

    try {
        const key = `papers/${paper.correspondingAuthor}/${paperId}-editor-version-${uuidv4()}`;
        const fileUrl = await uploadToSupabase(file, key);

        paper.editorVersionUrl = fileUrl;
        paper.editorVersionOriginalFilename = file.name;
        paper.status = "final-version-uploaded";
        await paper.save();

        return NextResponse.json({ message: "File uploaded successfully", fileUrl });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
    }
}
