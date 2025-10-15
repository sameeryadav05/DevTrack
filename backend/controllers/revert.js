const { supabase } = require('../config/supabaseClient.js');
const path = require('path');
const fs = require('fs');
const { promisify  } = require('util')

const readdir  = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile)

async function revert(commitId)
{
    const repoPath = path.resolve(process.cwd(),".devtrack")
    const commitsPath = path.join(repoPath,"commits")



    try {
        const commitDir = path.join(commitsPath,commitId)
        const files = await readdir(commitDir)
        const parentDir = path.resolve(repoPath,"..")
        for(const file of files)
        {
            await copyFile(path.join(commitDir,file),path.join(parentDir,file))

            console.log(`reverted to ${commitId} commit hash`)
        }
    } catch (error) {
        
        console.log(`Failed to revert to ${commitId}`,error);
    }
    
}

module.exports = {revert}