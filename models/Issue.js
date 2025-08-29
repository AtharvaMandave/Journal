const mongoose = require("mongoose");
const { Schema } = mongoose;

const IssueSchema = new Schema(
  {
    volume: { type: Number, required: true },
    issueNumber: { type: Number, required: true },
    year: { type: Number, required: true },
    publishedAt: { type: Date },
    papers: { type: [Schema.Types.ObjectId], ref: "Paper", default: [] },
    coverImageUrl: { type: String },
  },
  { timestamps: true }
);

const IssueModel = mongoose.models.Issue || mongoose.model("Issue", IssueSchema);

module.exports = { IssueModel };


