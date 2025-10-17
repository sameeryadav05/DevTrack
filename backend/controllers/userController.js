const {ExpressError} = require('../utils/ExpressError.js')
const {WrapAsync} = require('../utils/WrapAsync.js')



const getAllUser = async (req,res)=>{
    res.send("getting all users");
}

const getUserProfile = WrapAsync(async(req,res)=>{
    const user = req.user
    res.status(302).json({message:"profile found !",user});
})
const updateUserProfile = WrapAsync(async(req,res)=>{
    res.send("updated profile");
})
const DeleteUserProfile = WrapAsync(async(req,res)=>{
    res.send("deleted profile");
})

module.exports = {getAllUser,getUserProfile,updateUserProfile,DeleteUserProfile}