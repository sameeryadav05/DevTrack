const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        default:'https://imgs.search.brave.com/e_arwYgFLLE8RxnLAHSdAzwsXS2QvQVH6DGZSG0Z7vs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2h1dHRlcnN0b2Nr/LmNvbS9pbWFnZS12/ZWN0b3IvZGVmYXVs/dC1hdmF0YXItcHJv/ZmlsZS1pY29uLWdy/ZXktMjYwbnctNTE4/NzQwNzQxLmpwZw'
    }
},{timestamps:true})

const User = mongoose.model('User',userSchema)

module.exports = {User}