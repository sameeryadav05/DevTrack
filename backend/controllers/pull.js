const { supabase } = require('../config/supabaseClient.js');
const path = require('path');
const fs = require('fs').promises;

const bucketName = 'commits'; 

async function pull() {
  const repoPath = path.resolve(process.cwd(), '.devtrack');
  const commitsPath = path.join(repoPath, 'commits');

  try {

    const { data: files, error: listError } = await supabase
      .storage
      .from(bucketName)
      .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });

    if (listError) throw listError;
    if (!files.length) {
      console.log('No commits found in remote bucket.');
      return;
    }


    async function listAllFiles(pathPrefix = '') {
      const { data, error } = await supabase.storage.from(bucketName).list(pathPrefix);
      if (error) throw error;

      let allFiles = [];
      for (const item of data) {
        if (item.metadata) {
         
          allFiles.push(pathPrefix ? `${pathPrefix}/${item.name}` : item.name);
        } else {
        
          const subFiles = await listAllFiles(pathPrefix ? `${pathPrefix}/${item.name}` : item.name);
          allFiles = allFiles.concat(subFiles);
        }
      }
      return allFiles;
    }

    const allFiles = await listAllFiles();
    console.log(`Found ${allFiles.length} files in remote commits bucket`);

   
    for (const filePath of allFiles) {
      const { data, error: downloadError } = await supabase
        .storage
        .from(bucketName)
        .download(filePath);

      if (downloadError) {
        console.error(`Failed to download ${filePath}:`, downloadError.message);
        continue;
      }

      const localFilePath = path.join(commitsPath, filePath);
      await fs.mkdir(path.dirname(localFilePath), { recursive: true });
      await fs.writeFile(localFilePath, Buffer.from(await data.arrayBuffer()));

      console.log(`Pulled ${filePath}`);
    }

    console.log('All commits pulled successfully!');
  } catch (error) {
    console.error('Failed to pull:', error.message);
  }
}

module.exports = { pull };
