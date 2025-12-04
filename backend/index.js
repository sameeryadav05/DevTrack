const express = require("express");
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const dotenv = require("dotenv");
const httpStatus = require('http-status')
const { init } = require("./controllers/init.js");
const { add } = require("./controllers/add.js");
const { commit } = require("./controllers/commit.js");
const { push } = require("./controllers/push.js");
const { pull } = require("./controllers/pull.js");
const { revert } = require("./controllers/revert.js");
const { logCommits } = require("./controllers/log.js");
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




