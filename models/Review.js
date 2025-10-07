const mongoose = require("mongoose");
const { Schema } = mongoose;

const RECOMMENDATIONS = [
  "accept",
  "major-revision",
  "minor-revision",
  "reject",
];

const ReviewSchema = new Schema(
  {
    paperId: { type: Schema.Types.ObjectId, ref: "Paper", required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    // Comments visible to author
    comments: { type: String, default: "" },
    // Confidential comments for editor only
    editorNotes: { type: String, default: "" },
    recommendation: { type: String, enum: RECOMMENDATIONS, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ReviewModel = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

module.exports = { RECOMMENDATIONS, ReviewModel };


