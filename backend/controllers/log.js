const fs = require('fs').promises;
const path = require('path');

async function logCommits() {
  const repoPath = path.resolve(process.cwd(), '.devtrack');
  const commitsPath = path.join(repoPath, 'commits');

  try {
    // 1️ Check if commits folder exists
    const exists = await fs.stat(commitsPath).catch(() => null);
    if (!exists) {
      console.log('⚠️  No commits found. Run "devtrack commit" first.');
      return;
    }

    // 2️ Get all commit directories
    const items = await fs.readdir(commitsPath, { withFileTypes: true });
    const commits = items.filter(item => item.isDirectory()).map(item => item.name);

    if (commits.length === 0) {
      console.log('  No commits found yet.');
      return;
    }

    console.log('\n Commit History:\n');

    // 3️ Loop through each commit directory
    for (const commitId of commits.sort()) {
      const commitPath = path.join(commitsPath, commitId);
      const commitFilePath = path.join(commitPath, 'commit.json');

      try {
        const fileContent = await fs.readFile(commitFilePath, 'utf-8');
        const { message, date } = JSON.parse(fileContent);

        console.log(` Commit ID: ${commitId}`);
        console.log(` Message : ${message}`);
        console.log(` Date    : ${new Date(date).toLocaleString()}`);
        console.log('----------------------------------------');
      } catch {
        console.log(`  Missing or invalid commit.json in ${commitId}`);
      }
    }
  } catch (error) {
    console.error(' Failed to show commit logs:', error.message);
  }
}

module.exports = { logCommits };
