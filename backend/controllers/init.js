const fs = require('fs').promises;
const path = require('path')



async function init()
{
    const repoPath = path.resolve(process.cwd(),".devtrack")
    const commitsPath = path.join(repoPath,"commits");
    try {
        await fs.mkdir(repoPath,{recursive:true})
        await fs.mkdir(commitsPath,{recursive:true})
        await fs.writeFile(
            path.join(repoPath,"config.js"),
            JSON.stringify({bucket:process.env.S3_BUCKET})
        )
        console.log("Repository Initialized successfully !")
        
    } catch (error) {
        console.error("Error in initialising repository",error)
    }
}

module.exports = {init}