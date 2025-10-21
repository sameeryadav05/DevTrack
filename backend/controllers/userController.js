const { User } = require('../models/user.model.js');
const {ExpressError} = require('../utils/ExpressError.js')
const {WrapAsync} = require('../utils/WrapAsync.js')
const bcrypt = require('bcrypt')


const getAllUser = WrapAsync(async (req,res)=>{
    const allUsers = await User.find({});
    res.status(200).json({allUsers})
})

const getUserProfile = WrapAsync(async(req,res)=>{
    const userId = req.user.id;
    const user = await User.findById(userId); 
    if(!user)
    {
        throw new ExpressError(404,'User not found !');
    }
    const userData = {
        id:user._id,
        email:user.email,
        username:user.username,
        profileImage:user.profileImage,
    }
    res.status(302).json({message:"profile found !",userData});
})
const updateUserProfile = WrapAsync(async(req,res)=>{
    const userId = req.user.id
    const {password,username} = req.body

    if(password)
    {
        const hashedPassword = await bcrypt.hash(password,10)
        await User.findByIdAndUpdate(userId,{password:hashedPassword})
    }
    if(username)
    {
        await User.findByIdAndUpdate(userId,{username:username})
    }
    res.status(200).send("profile updated !");
})
const DeleteUserProfile = WrapAsync(async(req,res)=>{

    const userId = req.user.id;
    const user = await User.findById(userId)
    if(!user)
    {
        throw new ExpressError(400,"Profile not found !")
    }
    await User.findByIdAndDelete(userId);
    res.status(200).send("profile deleted");
})

module.exports = {getAllUser,getUserProfile,updateUserProfile,DeleteUserProfile}