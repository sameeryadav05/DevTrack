const express = require("express");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const dotenv = require("dotenv");
const httpStatus = require('http-status')
const { login, logout } = require("./controllers/cliController.js");
const { init, remoteAdd, remoteShow, add, status, commit, log, push, pull, revert } = require("./controllers/gitController.js");
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io');
const {mainRouter} = require('./routes/main.router.js')
const mongoose  = require("mongoose");
const { ExpressError } = require("./utils/ExpressError.js");
const cookieParser = require('cookie-parser');


dotenv.config();

async function start()
{
    const app = express();
    app.use(cors({
        origin:"http://localhost:5173",  // your React app URL
        credentials: true,                // allow sending cookies
        }));
        
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(cookieParser())
    app.use("/",mainRouter)
    const port = process.env.PORT || 3000;

    let user = "test"
    const httpServer = http.createServer(app)
    const io = new Server(httpServer,{
        cors:{
            origin:'*',
            methods:['GET','POST']
        }})


        // 404- not found handler
        app.use((req,res)=>{
            throw new ExpressError(404,"page not found")
        })
        
        // global error handler
        app.use((err,req,res,next)=>{
            const {status=500,message="Internal Server Error"} = err

            res.status(status).json({message})
        })


    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join-room", (userId) => {
            user = userId
            console.log("======")
            console.log(user)
            console.log("======")
            socket.join(userId)
        })

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        })
    })

    // const db = mongoose.connection;
    //     db.once("open",async ()=>{
    //         console.log("crud operation called")
    //     })

    await mongoose.connect(process.env.MONGODB_URL,{dbName:'DevTrack'})
        .then(()=>console.log('Database connected successfully !'))
        .catch((err)=>{console.log("Failed to connect with database",err.message);process.exit(1)})

    httpServer.listen(port, () => console.log("server is listening on port ", port))
 
}


yargs(hideBin(process.argv))
.command("start","command to start the server",{},start)
.command("login","Login to DevTrack CLI",{},login)
.command("logout","Logout from DevTrack CLI",{},logout)
.command("init","Initialize a new repository in current directory",{},init)
.command("remote [action] [repoId]","Manage remote repository",(yargs)=>{
    yargs.positional("action",{
        describe:"Action: 'add' to add remote, or omit to show",
        type:'string'
    })
    yargs.positional("repoId",{
        describe:"Repository ID (required when action is 'add')",
        type:'string'
    })
},async (argv)=>{
    if(argv.action === 'add') {
        if(!argv.repoId) {
            console.error('❌ Repository ID required. Usage: devtrack remote add <repoId>');
            process.exit(1);
        }
        await remoteAdd(argv.repoId);
    } else {
        await remoteShow();
    }
})
.command("add <files..>","Add files to staging area",(yargs)=>{
    yargs.positional("files",{
        describe:"Files to add (space-separated)",
        type:'array'
    })
},async (argv)=>{
    await add(argv.files)
})
.command("status","Show repository status",{},status)
.command("commit <message>","Commit staged files",(yargs)=>{
    yargs.positional("message",{
        describe:"Commit message",
        type:'string'
    })
},async (argv)=>{
    await commit(argv.message)
})
.command("log","Show commit history",{},log)
.command("push","Push commits to remote repository",{},push)
.command("pull","Pull commits from remote repository",{},pull)
.command("revert <commitId>","Revert to a specific commit",(yargs)=>{
    yargs.positional("commitId",{
        describe:"Commit ID to revert to",
        type:'string'
    })
},async (argv)=>{
    await revert(argv.commitId)
})
.demandCommand(1,"enter a command")
.help()
.alias('help', 'h')
.version('1.0.0')
.argv




