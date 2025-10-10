
import mongoose from 'mongoose';
import { connect } from '../lib/mongoose.js';
import { PaperModel } from '../models/Paper.js';

async function fixPublishedAt() {
  await connect();

  const papersToFix = await PaperModel.find({
    status: 'published',
    publishedAt: { $exists: false },
  });

  if (papersToFix.length === 0) {
    console.log('No papers to fix.');
    return;
  }

  console.log(`Found ${papersToFix.length} papers to fix.`);

  for (const paper of papersToFix) {
    paper.publishedAt = new Date();
    await paper.save();
    console.log(`Fixed paper: ${paper.title}`);
  }

  console.log('Finished fixing papers.');
}

fixPublishedAt().then(() => mongoose.disconnect());
