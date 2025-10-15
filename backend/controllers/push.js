const { supabase } = require('../config/supabaseClient.js');
const path = require('path');
const fs = require('fs').promises;

const bucketName = 'commits'; // your Supabase bucket name

async function push() {
  const repoPath = path.resolve(process.cwd(), '.devtrack');
  const commitsPath = path.join(repoPath, 'commits');

  try {
    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath); // returns Buffer

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(`${commitDir}/${file}`, fileContent, { upsert: true });

        if (error) {
          console.error(`❌ Failed to upload ${file}:`, error.message);
        } else {
          console.log(`Uploaded ${file} to commit ${commitDir}`);
        }
      }
    }

    console.log('All commits pushed successfully!');
  } catch (error) {
    console.error('Failed to push files:', error.message);
  }
}

module.exports = { push };
