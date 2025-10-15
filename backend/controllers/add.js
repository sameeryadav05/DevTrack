const fs = require('fs').promises
const path = require('path')


async function add(filepath) {
    const repoPath = path.resolve(process.cwd(),".devtrack");
    const stagingPath = path.join(repoPath,"staging");

    try {
        await fs.mkdir(stagingPath,{recursive:true})
        const fileName = path.basename(filepath);
        await fs.copyFile(filepath,path.join(stagingPath,fileName))
        console.log(`File ${fileName} added to staging area`)
    } catch (error) {
        console.log("Error to add the file ",error);
    }
}
module.exports = {add}