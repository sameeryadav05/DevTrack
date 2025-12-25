const mongoose = require('mongoose')

const repoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String
    },
    content:[
        {
            type:String,

        }
    ],
    visibility:{
        type:String,
        enum:["public","private"],
        default:"public"
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    issues:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Issue'
        }
    ],
    initialized: {
        type: Boolean,
        default: false
    },
    stagedFiles: [{
        filename: String,
        content: String,
        path: String
    }]
})
const Repository = mongoose.model('Repository',repoSchema);

module.exports = {Repository}