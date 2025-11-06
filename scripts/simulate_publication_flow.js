/*
 End-to-end simulation of the journal workflow:
 - Creates sample users (author, editor, two reviewers)
 - Submits a paper
 - Assigns reviewers
 - Submits two reviews (one positive, one negative)
 - Takes two decision paths: accept and reject (on cloned docs)
 - Creates an issue and publishes accepted paper

 Usage:
   node scripts/simulate_publication_flow.js
*/

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { connect } = require("../lib/mongoose");
const { UserModel } = require("../models/User");
const { PaperModel } = require("../models/Paper");
const { ReviewModel } = require("../models/Review");
const { IssueModel } = require("../models/Issue");

async function ensureUser({ name, email, role }) {
  let user = await UserModel.findOne({ email });
  if (!user) {
    user = await UserModel.create({ name, email, role, passwordHash: "placeholder" });
  }
  return user;
}

async function main() {
  await connect();

  const author = await ensureUser({ name: "Alice Author", email: "alice.author@example.com", role: "author" });
  const editor = await ensureUser({ name: "Eddie Editor", email: "eddie.editor@example.com", role: "editor" });
  const reviewer1 = await ensureUser({ name: "Rita Reviewer", email: "rita.reviewer@example.com", role: "reviewer" });
  const reviewer2 = await ensureUser({ name: "Ron Reviewer", email: "ron.reviewer@example.com", role: "reviewer" });

  console.log("Users ready:", { author: author.email, editor: editor.email, reviewer1: reviewer1.email, reviewer2: reviewer2.email });

  // Submit a paper
  const paper = await PaperModel.create({
    title: "A Sample Study on Performance Optimizations",
    abstract: "This study explores indexing, caching, and async pipelines to improve performance.",
    authors: [
      { name: author.name, email: author.email, affiliation: "Example University" },
    ],
    correspondingAuthor: author._id,
    keywords: ["performance", "indexing", "caching"],
    fileUrl: "https://example.com/sample.pdf",
    status: "submitted",
  });
  console.log("Submitted paper:", paper._id.toString());

  // Assign reviewers
  const assigned = await PaperModel.findByIdAndUpdate(
    paper._id,
    { $addToSet: { assignedReviewers: { $each: [reviewer1._id, reviewer2._id] } }, status: "under-review" },
    { new: true }
  );
  console.log("Assigned reviewers:", assigned.assignedReviewers.map((id) => id.toString()));

  // Submit two reviews
  const reviewA = await ReviewModel.create({ paperId: paper._id, reviewerId: reviewer1._id, rating: 5, comments: "Strong paper.", recommendation: "accept" });
  const reviewB = await ReviewModel.create({ paperId: paper._id, reviewerId: reviewer2._id, rating: 2, comments: "Needs work.", recommendation: "major-revision" });
  await PaperModel.findByIdAndUpdate(paper._id, { $addToSet: { reviews: { $each: [reviewA._id, reviewB._id] } } });
  console.log("Reviews submitted:", [reviewA._id.toString(), reviewB._id.toString()]);

  // Decision path A: accept (clone doc for branch)
  const toAccept = await PaperModel.create({
    title: paper.title + " (Accept Branch)",
    abstract: paper.abstract,
    authors: paper.authors,
    correspondingAuthor: author._id,
    keywords: paper.keywords,
    fileUrl: paper.fileUrl,
    status: "submitted",
  });
  await PaperModel.findByIdAndUpdate(toAccept._id, { status: "accepted" });
  console.log("Decision A -> accepted:", toAccept._id.toString());

  // Create issue and publish
  const issue = await IssueModel.create({ volume: 1, issueNumber: 1, year: new Date().getFullYear(), papers: [toAccept._id], coverImageUrl: "" });
  await IssueModel.findByIdAndUpdate(issue._id, { publishedAt: new Date() });
  await PaperModel.findByIdAndUpdate(toAccept._id, { status: "published", issueId: issue._id });
  console.log("Published paper in issue:", { paperId: toAccept._id.toString(), issueId: issue._id.toString() });

  // Decision path B: reject (clone doc for branch)
  const toReject = await PaperModel.create({
    title: paper.title + " (Reject Branch)",
    abstract: paper.abstract,
    authors: paper.authors,
    correspondingAuthor: author._id,
    keywords: paper.keywords,
    fileUrl: paper.fileUrl,
    status: "submitted",
  });
  await PaperModel.findByIdAndUpdate(toReject._id, { status: "rejected" });
  console.log("Decision B -> rejected:", toReject._id.toString());

  console.log("Simulation complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    try { await mongoose.connection.close(); } catch {}
    process.exit(0);
  });


