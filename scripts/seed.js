require("dotenv").config();
const bcrypt = require("bcryptjs");
const { connect } = require("../lib/mongoose");
const { UserModel } = require("../models/User");
const { PaperModel } = require("../models/Paper");

async function upsertUser({ name, email, role }) {
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const existing = await UserModel.findOne({ email });
  if (existing) return existing;
  return UserModel.create({ name, email, role, passwordHash, affiliation: "Sample University" });
}

async function createSamplePapers(users) {
  const [admin, editor, reviewer, author] = users;
  const papers = [
    {
      title: "Quantum Widgets for Distributed Systems",
      abstract: "An exploration of widget behavior in quantum-like networks.",
      authors: [
        { name: author.name, email: author.email, affiliation: author.affiliation },
      ],
      correspondingAuthor: author._id,
      keywords: ["widgets", "distributed", "quantum"],
      status: "submitted",
      assignedReviewers: [reviewer._id],
    },
    {
      title: "Optimizing Review Workflows with AI",
      abstract: "How LLMs can streamline peer review.",
      authors: [
        { name: author.name, email: author.email, affiliation: author.affiliation },
      ],
      correspondingAuthor: author._id,
      keywords: ["AI", "review", "workflow"],
      status: "under-review",
      assignedReviewers: [reviewer._id],
    },
    {
      title: "Accepted Practices in Scholarly Publishing",
      abstract: "A survey of accepted practices and standards.",
      authors: [
        { name: author.name, email: author.email, affiliation: author.affiliation },
      ],
      correspondingAuthor: author._id,
      keywords: ["publishing", "standards"],
      status: "accepted",
      assignedReviewers: [reviewer._id],
    },
  ];

  await PaperModel.deleteMany({});
  return PaperModel.insertMany(papers);
}

async function main() {
  await connect();
  console.log("Connected to MongoDB");

  const admin = await upsertUser({
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  });
  const editor = await upsertUser({
    name: "Editor User",
    email: "editor@example.com",
    role: "editor",
  });
  const reviewer = await upsertUser({
    name: "Reviewer User",
    email: "reviewer@example.com",
    role: "reviewer",
  });
  const author = await upsertUser({
    name: "Author User",
    email: "author@example.com",
    role: "author",
  });

  const papers = await createSamplePapers([admin, editor, reviewer, author]);

  console.log("Seeded users:", {
    admin: admin.email,
    editor: editor.email,
    reviewer: reviewer.email,
    author: author.email,
  });
  console.log("Seeded papers:", papers.map((p) => ({ title: p.title, status: p.status })));

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


