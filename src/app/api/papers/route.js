import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongooseModule from "../../../../lib/mongoose";
import paperModule from "../../../../models/Paper";
import userModule from "../../../../models/User";
import { getSupabaseClient } from "../../../../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { sendMail } from "../../../../lib/email";

const { connect } = mongooseModule;
const { PaperModel } = paperModule;
const { UserModel } = userModule;

const AuthorSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  affiliation: z.string().optional().default(""),
});

const PaperInputSchema = z.object({
  title: z.string().min(3),
  abstract: z.string().min(20),
  keywords: z.array(z.string()).max(12).optional().default([]),
  authors: z.array(AuthorSchema).min(1),
  correspondingAuthorEmail: z.string().email(),
  file: z
    .object({
      name: z.string(),
      type: z.string().refine((t) => t === "application/pdf", "File must be a PDF"),
      size: z.number().max(25 * 1024 * 1024),
    })
    .optional(),
  fileUrl: z.string().url().optional(),
});

export async function POST(request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const body = await request.json();
      const parsed = PaperInputSchema.safeParse(body);
  
      if (!parsed.success) {
        console.error("Validation error:", parsed.error.format()); // ✅ more structured logging
        return NextResponse.json(
          { error: parsed.error.flatten() },
          { status: 400 }
        );
      }
  
      const { title, abstract, keywords, authors, correspondingAuthorEmail, file, fileUrl } = parsed.data;
  
      await connect();
      const corresponding = await UserModel.findOne({ email: correspondingAuthorEmail });
      if (!corresponding) {
        return NextResponse.json({ error: "Corresponding author not found" }, { status: 404 });
      }
  
      let computedFileUrl = fileUrl || "";
      if (file) {
        const supabase = getSupabaseClient();
        const key = `papers/${corresponding._id}/${uuidv4()}-${file.name}`;
        const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'papers';

        const { data, error } = await supabase.storage
          .from(bucket)
          .createSignedUploadUrl(key);

        if (error) {
          throw new Error(`Supabase signed URL error: ${error.message}`);
        }

        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(key);
        computedFileUrl = publicUrl;

        return NextResponse.json({ uploadUrl: data.signedUrl, fileUrl: computedFileUrl });
      }
  
      const submissionId = `TS-${Date.now().toString(36)}-${uuidv4().slice(0,8).toUpperCase()}`;

      const doc = await PaperModel.create({
        title,
        abstract,
        authors,
        correspondingAuthor: corresponding._id,
        keywords,
        status: "submitted",
        fileUrl: computedFileUrl || undefined,
        submissionId,
      });
  
      if (corresponding.email) {
        sendMail({
          to: corresponding.email,
          subject: "Submission received",
          html: `<p>Dear ${corresponding.name || "Author"},</p><p>Your paper "${title}" has been received.</p><p>Submission ID: <strong>${submissionId}</strong></p>`,
        }).catch(() => {});
      }
  
      return NextResponse.json({ id: String(doc._id), submissionId }, { status: 201 });
    } catch (e) {
      console.error("API error:", e);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const UpdateSchema = PaperInputSchema.extend({ id: z.string() });
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { id, title, abstract, keywords, authors, correspondingAuthorEmail, file, fileUrl } = parsed.data;
    await connect();

    // Verify paper ownership and status
    const paper = await PaperModel.findById(id);
    if (!paper) return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    if (String(paper.correspondingAuthor) !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (paper.status !== "revise") {
      return NextResponse.json({ error: "Can only resubmit when status is 'revise'" }, { status: 400 });
    }

    // Handle optional new file upload via presigned URL request
    let newFileUrl = fileUrl || paper.fileUrl || "";
    if (file) {
      const supabase = getSupabaseClient();
      const key = `papers/${paper.correspondingAuthor}/${uuidv4()}-${file.name}`;
            const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'papers';

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUploadUrl(key);

      if (error) {
        throw new Error(`Supabase signed URL error: ${error.message}`);
      }

      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(key);
      newFileUrl = publicUrl;

      return NextResponse.json({ uploadUrl: data.signedUrl, fileUrl: newFileUrl });
    }

    // Update paper metadata and reset workflow to submitted
    paper.title = title;
    paper.abstract = abstract;
    paper.keywords = keywords || [];
    paper.authors = authors;
    paper.fileUrl = newFileUrl || undefined;
    paper.status = "submitted";
    paper.assignedReviewers = [];
    paper.reviews = [];
    await paper.save();

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
  