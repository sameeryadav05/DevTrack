const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {Repository} = require('./repo.model.js')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    accountVerified:{
        type:Boolean,
        default:false
    },
    verificationCode:{type:Number},
    verificationCodeExpire:{type:Date},
    repositories:[
        {
            default:[],
            type:mongoose.Schema.Types.ObjectId,
            ref:'Repository'
        }

    ],
    followedUsers:[
        {
            default:[],
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }

    ],
    starRepositories:[
        {
            default:[],
            type:mongoose.Schema.Types.ObjectId,
            ref:'Repository'
        }

    ],
    profileImage:{
        type:String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAawXym9h3iWX_dAweGdIo3emZpdTQTPwgZw&s'
    }
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified('password'))
    {
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.post('findOneAndDelete', async (doc) => {
    if (doc.repositories.length) {
        await Repository.deleteMany({ _id: { $in: doc.repositories} })
        console.log(`Deleted ${doc.repositories.length} repositories of user ${doc.username}`)
    }
})


userSchema.methods.comparePassword = async function(Password)
{
    return await bcrypt.compare(Password,this.password)
}

userSchema.methods.generateVerificationCode = async function(){

    const firstDigit = Math.floor(Math.random() * 9)+1;
    const remainingDigit = Math.floor(Math.random() * 10000).toString().padStart(4,0)
    const verificationCode =  parseInt(firstDigit+remainingDigit)
    this.verificationCode = verificationCode
    this.verificationCodeExpire = Date.now() + (5*60*1000)
    return verificationCode
}

const User = mongoose.model('User',userSchema)

module.exports = {User}