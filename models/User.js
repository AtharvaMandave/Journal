const mongoose = require("mongoose");
const { Schema } = mongoose;

const USER_ROLES = ["author", "reviewer", "editor", "admin"];

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, default: "author", required: true },
    affiliation: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = { USER_ROLES, UserModel };


