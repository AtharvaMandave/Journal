const mongoose = require("mongoose");
const { Schema } = mongoose;

const AnnouncementSchema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    deadline: { type: Date },
    type: { type: String, enum: ["cfp", "notice"], default: "cfp" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AnnouncementModel = mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);

module.exports = { AnnouncementModel };


