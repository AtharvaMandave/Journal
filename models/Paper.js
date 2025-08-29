const mongoose = require("mongoose");
const { Schema } = mongoose;

const PAPER_STATUSES = [
  "submitted",
  "under-review",
  "revise",
  "accepted",
  "rejected",
  "published",
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
    status: { type: String, enum: PAPER_STATUSES, default: "submitted", required: true },
    assignedReviewers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    reviews: { type: [Schema.Types.ObjectId], ref: "Review", default: [] },
    issueId: { type: Schema.Types.ObjectId, ref: "Issue", default: null },
  },
  { timestamps: true }
);

const PaperModel = mongoose.models.Paper || mongoose.model("Paper", PaperSchema);

module.exports = { PAPER_STATUSES, PaperModel };


