const express = require("express");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const dotenv = require("dotenv");
const { init } = require("./controllers/init.js");
const { add } = require("./controllers/add.js");
const { commit } = require("./controllers/commit.js");
const { push } = require("./controllers/push.js");
const { pull } = require("./controllers/pull.js");
const { revert } = require("./controllers/revert.js");
const { logCommits } = require("./controllers/log.js");

yargs(hideBin(process.argv))
.command("init","To Initialize a new Repository",{},init)
.command("add <file>","Add a file to Repository",(yargs)=>
    {
        yargs.positional("file",{
            describe:'Add file to staging area',
            type:'string'})
    },(argv)=>{
        add(argv.file)
    })
.command("commit <message>","commit the staged files",(yargs)=>{
    yargs.positional("message",{
        describe:"commit message",
        type:'string'
    })
},(argv)=>commit(argv.message))
.command("push","push commits",{},push)
.command("log","log commits",{},logCommits)
.command("pull","pull commits",{},pull)
.command("revert <commitId>","Revert to a commit",(yargs)=>{
    yargs.positional("commitId",{
        describe:"commit Id to which revert",
        type:'string'
    })
},(argv)=>revert(argv.commitId))
.demandCommand(1,"enter a command")
.help().argv

dotenv.config();

const app = express();
const port = process.env.PORT;

// app.listen(port, () => console.log("server us listening on port ", port));
