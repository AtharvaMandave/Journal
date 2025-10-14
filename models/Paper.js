const mongoose = require("mongoose");
const { Schema } = mongoose;

const PAPER_STATUSES = [
  "submitted",
  "under-review",
  "revise",
  "pending-approval",
  "editor-rejected",
  "accepted",
  "rejected",
  "published",
  "ready-for-publication",
  "final-version-uploaded",
];

const AuthorSubSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    affiliation: { type: String },
  },
  { _id: false }
);

const PaperSchema = new Schema(
  {
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    authors: { type: [AuthorSubSchema], default: [], required: true },
    correspondingAuthor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    keywords: { type: [String], default: [] },
    fileUrl: { type: String },
    editorVersionUrl: { type: String },
    editorVersionOriginalFilename: { type: String },
    finalVersionUrl: { type: String },
    finalVersionOriginalFilename: { type: String },
    status: { type: String, enum: PAPER_STATUSES, default: "submitted", required: true },
    assignedReviewers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    reviews: { type: [Schema.Types.ObjectId], ref: "Review", default: [] },
    issueId: { type: Schema.Types.ObjectId, ref: "Issue", default: null },
    // Workflow metadata
    submissionId: { type: String },
    editorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    screened: { type: Boolean, default: false },
    screeningNotes: { type: String, default: "" },
    doi: { type: String, default: "", index: true },
    publishedAt: { type: Date },
    reviewerInvites: {
      type: [
        new Schema(
          {
            reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
            status: { type: String, enum: ["invited", "accepted", "declined"], default: "invited" },
            invitedAt: { type: Date, default: Date.now },
            respondedAt: { type: Date },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Indexes to speed up common queries and sorts
// Lists and filters
PaperSchema.index({ status: 1, createdAt: -1 });
PaperSchema.index({ correspondingAuthor: 1, createdAt: -1 });
PaperSchema.index({ assignedReviewers: 1, createdAt: -1 });
PaperSchema.index({ issueId: 1, createdAt: -1 });
PaperSchema.index({ createdAt: -1 });
PaperSchema.index({ submissionId: 1 });
PaperSchema.index({ editorId: 1 });

// Text index for archive/search pages
// Note: text index on array field (keywords) is supported in MongoDB
try {
  PaperSchema.index({ title: "text", abstract: "text", keywords: "text" }, { weights: { title: 5, abstract: 2, keywords: 1 } });
} catch {}

const PaperModel = mongoose.models.Paper || mongoose.model("Paper", PaperSchema);

module.exports = { PAPER_STATUSES, PaperModel };